const getAccessibleDocs = (req, limit, offset, order) => {
  if (req.query.q) {
    return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access" FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" \
WHERE (("Users"."roleId" = ${req.decoded.RoleId} AND "Documents"."access" = 'role') OR \
("Documents"."access" = 'public')) AND ("Documents"."title" ILIKE '%${req.query.q}%') \
ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
  }
  return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access" FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" \
WHERE ("Users"."roleId" = ${req.decoded.RoleId} AND "Documents"."access" = 'role') OR \
("Documents"."access" = 'public') \
ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
};

const countAccessibleDocs = (req) => {
  if (req.query.q) {
    return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" WHERE 
    (("Users"."roleId" = ${req.decoded.RoleId} AND "Documents"."access" = 'role') OR ("Documents"."access" = 'public')) AND ("Documents"."title" ILIKE '%${req.query.q}%')`;
  }
  return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" 
  WHERE ("Users"."roleId" = ${req.decoded.RoleId} AND "Documents"."access" = 'role') OR 
  ("Documents"."access" = 'public')`;
};
export {
  getAccessibleDocs,
  countAccessibleDocs
};
