const allowedLicensePatterns = [
  /^CC0$/i,
  /^Public domain$/i,
  /^PDM$/i,
  /^CC BY(?:-| )/i,
  /^CC BY-SA(?:-| )/i
];

export function validateLicense(metadata = {}) {
  const license = cleanHtml(metadata.LicenseShortName?.value);
  const licenseUrl = metadata.UsageTerms?.value || metadata.LicenseUrl?.value || "";
  const author = cleanHtml(metadata.Artist?.value);
  const credit = cleanHtml(metadata.Credit?.value);

  const verified = Boolean(license) && allowedLicensePatterns.some((pattern) => pattern.test(license));

  return {
    verified,
    license,
    licenseUrl,
    author: author || "Unknown author",
    credit
  };
}

function cleanHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
