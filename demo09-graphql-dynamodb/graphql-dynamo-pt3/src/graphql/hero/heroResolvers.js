const resolvers = {

  Hero: {
    async skills (root, args, context) {
      const skills = root.skills.map(skill => context.Skill.findOne(skill))
      const results = await Promise.all(skills)
      const all = results.reduce((prev, next) => prev.concat(next), [])
      return all
    }
  },
  // GET
  Query: {
    async getHero (root, args, context, info) {
      console.log('args', { args })
      console.log('context', context)
      return context.Hero.findAll(args)
    }
  },
  // POST (atualizações, cadastro, remoção)
  Mutation: {
    async createHero (root, args, context, info) {
      return context.Hero.create(args.data)
    }
  }
}
module.exports = resolvers
