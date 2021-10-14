const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const user = prisma.logoutToken

module.exports = user