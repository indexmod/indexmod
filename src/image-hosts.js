export const APPROVED_IMAGE_HOSTS = [
"aros.dk",
"upload.wikimedia.org",
"images.unsplash.com",
"live.staticflickr.com",
"iiif.europeana.eu",
"leader-id.ru",
"archrevue.ru"
];


export function isApprovedImageHost(hostname = "") {


return APPROVED_IMAGE_HOSTS.some(host =>
hostname === host
||
hostname.endsWith(`.${host}`)
);


}
