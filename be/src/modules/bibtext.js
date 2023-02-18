const { parseBibFile } = require("bibtex");
const fs = require("fs");

main();
async function main() {
  let ids = fs.readFileSync("/Users/tuanle/ind/comment-survey-3/be/articles_ids.json", "utf8");
  ids = JSON.parse(ids);
  const bibData = fs.readFileSync("/Users/tuanle/Downloads/BibFile/K5.bib", "utf8");

  const bibFile = parseBibFile(bibData);

  let noID = 0,
    hasId = 0;
  let content = "";

  bibFile.entries_raw.forEach(item => {
    const { type, fields } = item;

    const author = fields.author.data.join("");
    const title = fields.title.data.join("");
    const journal = fields.journal?.data.join(""); //
    const publisher = fields.publisher?.data.join("");
    const url = fields.url?.data.join("");
    const fulltext = fields.fulltext?.data.join(""); //
    const related = fields.related?.data.join("");
    const year = fields.year?.data.join("");
    const abstract = fields.abstract?.data.join("");
    const note = fields.note?.data.join("");

    const key = [author, title].join();
    const id = ids[key];

    if (id) {
      hasId++;
      content += `
@${type}{${id},
			${author ? `author = {${author}},` : ""}
			title = {${title}},
			${type === "article" ? `journal = {${journal}},` : ""} 
			${publisher ? `publisher = {${publisher}},` : ""}
			${url ? `url = {${url}},` : ""}
			${fulltext ? `fulltext = {${fulltext}},` : ""}
			${related ? `related = {${related}},` : ""}
			${year ? `year = {${year}},` : ""}
			${abstract ? `abstract = {${abstract}},` : ""}
			${note ? `note = {${note}},` : ""}
}
			`;
    } else {
      noID++;
    }
  });
  console.log(hasId, noID);
  fs.writeFileSync("K5.bib", content);
  console.log("DONE");
}
