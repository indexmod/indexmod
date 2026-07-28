export function isAllowedImageSourceUrl(sourceUrl) {


if(
sourceUrl.protocol !== "https:"
&&
sourceUrl.protocol !== "http:"
)
return false;


const hostname =
sourceUrl.hostname
.toLowerCase()
.replace(/^\[(.*)\]$/, "$1");


if(
!hostname
||
hostname === "localhost"
||
hostname.endsWith(".localhost")
||
hostname.endsWith(".local")
)
return false;


if(isBlockedIPv4(hostname))
return false;


if(isBlockedIPv6(hostname))
return false;


return true;


}



function isBlockedIPv4(hostname = "") {


const parts =
hostname
.split(".")
.map(part => Number(part));


if(
parts.length !== 4
||
parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)
)
return false;


const [a, b] =
parts;


return (
a === 0
||
a === 10
||
a === 127
||
(a === 169 && b === 254)
||
(a === 172 && b >= 16 && b <= 31)
||
(a === 192 && b === 168)
);


}



function isBlockedIPv6(hostname = "") {


const value =
hostname.toLowerCase();


return (
value === "::1"
||
value === "0:0:0:0:0:0:0:1"
||
value.startsWith("fc")
||
value.startsWith("fd")
||
value.startsWith("fe80:")
);


}
