function getColor(value, isHex = false) {
    switch (value) {
        case 1:
            return !isHex ? 0x0284c7 : '#0284c7';
        case 2:
            return !isHex ? 0xca8a04 : '#ca8a04';
        case 3:
            return !isHex ? 0xdc2626 : '#dc2626';
        case 4:
            return !isHex ? 0xdb2777 : '#db2777';
        default:
            return !isHex ? 0x2d2d2d : '#2d2d2d';
    }
}

function lightenHexColor(hex, factor) {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    r = Math.floor(r + (255 - r) * factor);
    g = Math.floor(g + (255 - g) * factor);
    b = Math.floor(b + (255 - b) * factor);
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    const lightenedHex = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
    return lightenedHex;
}


export { getColor, lightenHexColor };

