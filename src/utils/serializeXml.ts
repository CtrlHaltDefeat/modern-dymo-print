/**
 * Serializes an XMLDocument to a string.\
 * This function also fixes self-closing \<Color red="255"/> tags by converting them to \<Color red="255"> \</Color>.
 */
export default function serializeXml(xmlDocument: XMLDocument): string {
	return new XMLSerializer().serializeToString(xmlDocument).replaceAll(
		/<Color (.+)\/>/g,
		"<Color $1> </Color>",
	);
}
