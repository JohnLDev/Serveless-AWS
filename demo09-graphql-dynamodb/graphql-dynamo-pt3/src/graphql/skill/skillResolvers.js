const resolvers = {
  // GET
  Query: {
    async getSkill (root, args, context, info) {
      console.log('args', { args })
      console.log('context', context)
      return context.Skill.findAll(args)
    }
  },
  // POST (atualizações, cadastro, remoção)
  Mutation: {
    async createSkill (root, args, context, info) {
      return context.Skill.create(args.data)
    }
  }
}
module.exports = resolvers
