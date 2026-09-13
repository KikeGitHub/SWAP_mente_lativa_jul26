const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function getDosDateTime(date) {
  const d = date || new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (Math.floor(d.getSeconds() / 2));
  const dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time, date: dt };
}

function createZip(sourceDir, zipPath, rootFolderName) {
  const entries = [];

  function walk(currentDir, relativeDir) {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      const relPath = (relativeDir ? relativeDir + '/' : '') + file;

      if (stat.isDirectory()) {
        walk(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath);
        const crc = crc32(content);
        const compressed = zlib.deflateRawSync(content);
        // Ensure standard forward slashes
        const zipEntryName = rootFolderName ? `${rootFolderName}/${relPath}` : relPath;
        entries.push({
          name: zipEntryName,
          content,
          compressed,
          crc,
          size: content.length,
          compressedSize: compressed.length,
          mtime: stat.mtime
        });
      }
    }
  }

  walk(sourceDir, '');

  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const { time, date } = getDosDateTime(entry.mtime);

    // Local file header (30 bytes + nameBuf.length)
    const localHdr = Buffer.alloc(30);
    localHdr.writeUInt32LE(0x04034b50, 0); // signature
    localHdr.writeUInt16LE(20, 4);         // version needed: 2.0
    localHdr.writeUInt16LE(0x0800, 6);      // general purpose bit flag (bit 11 = UTF-8)
    localHdr.writeUInt16LE(8, 8);          // compression method: Deflate (8)
    localHdr.writeUInt16LE(time, 10);
    localHdr.writeUInt16LE(date, 12);
    localHdr.writeUInt32LE(entry.crc, 14);
    localHdr.writeUInt32LE(entry.compressedSize, 18);
    localHdr.writeUInt32LE(entry.size, 22);
    localHdr.writeUInt16LE(nameBuf.length, 26);
    localHdr.writeUInt16LE(0, 28);         // extra field length

    localHeaders.push(localHdr);
    localHeaders.push(nameBuf);
    localHeaders.push(entry.compressed);

    // Central directory header (46 bytes + nameBuf.length)
    const centralHdr = Buffer.alloc(46);
    centralHdr.writeUInt32LE(0x02014b50, 0); // signature
    centralHdr.writeUInt16LE(20, 4);         // version made by (DOS/FAT)
    centralHdr.writeUInt16LE(20, 6);         // version needed
    centralHdr.writeUInt16LE(0x0800, 8);      // UTF-8 flag
    centralHdr.writeUInt16LE(8, 10);         // Deflate
    centralHdr.writeUInt16LE(time, 12);
    centralHdr.writeUInt16LE(date, 14);
    centralHdr.writeUInt32LE(entry.crc, 16);
    centralHdr.writeUInt32LE(entry.compressedSize, 20);
    centralHdr.writeUInt32LE(entry.size, 24);
    centralHdr.writeUInt16LE(nameBuf.length, 28);
    centralHdr.writeUInt16LE(0, 30);         // extra field length
    centralHdr.writeUInt16LE(0, 32);         // comment length
    centralHdr.writeUInt16LE(0, 34);         // disk number start
    centralHdr.writeUInt16LE(0, 36);         // internal file attributes
    centralHdr.writeUInt32LE(0, 38);         // external file attributes
    centralHdr.writeUInt32LE(offset, 42);    // relative offset of local header

    centralHeaders.push(centralHdr);
    centralHeaders.push(nameBuf);

    offset += localHdr.length + nameBuf.length + entry.compressed.length;
  }

  const centralDirOffset = offset;
  const centralDirSize = centralHeaders.reduce((acc, b) => acc + b.length, 0);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);       // signature
  eocd.writeUInt16LE(0, 4);                // disk number
  eocd.writeUInt16LE(0, 6);                // disk with central dir
  eocd.writeUInt16LE(entries.length, 8);   // entries on this disk
  eocd.writeUInt16LE(entries.length, 10);  // total entries
  eocd.writeUInt32LE(centralDirSize, 12);  // size of central dir
  eocd.writeUInt32LE(centralDirOffset, 16);// offset of central dir
  eocd.writeUInt16LE(0, 20);               // comment length

  const allBuffers = [...localHeaders, ...centralHeaders, eocd];
  fs.writeFileSync(zipPath, Buffer.concat(allBuffers));
  console.log(`Created ${zipPath} successfully with ${entries.length} entries. Forward slashes guaranteed.`);
}

const themeDir = path.join(__dirname, 'mente-lativa-theme');
const outZip = path.join(__dirname, 'mente-lativa-theme.zip');
createZip(themeDir, outZip, 'mente-lativa-theme');
