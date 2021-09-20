const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const user = prisma.user

module.exports = user