const getUserAccessibleDocs = (req, limit, offset, order) => {
  if (req.query.q) {
    return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access", "Users"."firstname", "Users"."lastname" FROM "Documents" INNER JOIN "Users" ON \
"Documents"."creatorId" = "Users"."id" WHERE "Documents"."creatorId" = ${req.decoded.userId} OR \
(("Users"."roleId"=${req.decoded.roleId} AND "Documents"."access"='role') OR ("Documents"."access" = 'public')) AND \
("Documents"."title" ILIKE '%${req.query.q}%') ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
  }
  return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access", "Users"."firstname", "Users"."lastname" FROM "Documents" INNER JOIN "Users" \
ON "Documents"."creatorId" = "Users"."id" WHERE "Documents"."creatorId" = ${req.decoded.userId} OR \
(("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role') OR ("Documents"."access" = 'public')) \
ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
};

const countUserAccessibleDocs = (req) => {
  if (req.query.q) {
    return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" WHERE 
    "Documents"."creatorId" = ${req.decoded.userId} OR \
    (("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role') OR \
    ("Documents"."access" = 'public')) \
    AND ("Documents"."title" ILIKE '%${req.query.q}%')`;
  }
  return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" 
  WHERE "Documents"."creatorId" = ${req.decoded.userId} OR \
  (("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role') OR \
  ("Documents"."access" = 'public'))`;
};

const getDocumentsOfUser = (req, limit, offset, order) => {
  if (req.query.q) {
    return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access", "Users"."firstname", "Users"."lastname" FROM "Documents" INNER JOIN "Users" ON \
"Documents"."creatorId" = "Users"."id" WHERE "Documents"."creatorId" = ${req.params.id} AND \
(("Users"."roleId"=${req.decoded.roleId} AND "Documents"."access"='role') OR ("Documents"."access" = 'public')) \
AND ("Documents"."title" ILIKE '%${req.query.q}%') \
ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
  }
  return `SELECT "Documents"."id" as id, "Documents"."title", "Documents"."content", "Documents"."creatorId", \
"Documents"."access", "Users"."firstname", "Users"."lastname" FROM "Documents" INNER JOIN "Users" \
ON "Documents"."creatorId" = "Users"."id" WHERE "Documents"."creatorId" = ${req.params.id} AND \
(("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role') OR ("Documents"."access" = 'public')) \
ORDER by "Documents".${order} LIMIT ${limit} OFFSET ${offset}`;
};

const countDocumentsOfUser = (req) => {
  if (req.query.q) {
    return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" WHERE 
    "Documents"."creatorId" = ${req.params.id} AND (("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role')
    OR ("Documents"."access" = 'public')) AND ("Documents"."title" ILIKE '%${req.query.q}%')`;
  }
  return `SELECT COUNT (*) FROM "Documents" INNER JOIN "Users" ON "Documents"."creatorId" = "Users"."id" 
  WHERE "Documents"."creatorId" = ${req.params.id} AND (("Users"."roleId" = ${req.decoded.roleId} AND "Documents"."access" = 'role')
  OR ("Documents"."access" = 'public'))`;
};

export {
  getUserAccessibleDocs,
  countUserAccessibleDocs,
  getDocumentsOfUser,
  countDocumentsOfUser
};
