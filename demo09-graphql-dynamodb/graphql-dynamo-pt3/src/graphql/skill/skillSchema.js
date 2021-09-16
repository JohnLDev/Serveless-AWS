const typeDefinition = `
    type Skill {
        id: String
        name: String
        value: Int
    }
    input SkillInput {
        name: String
        value: Int
    }

    type Query {
        getSkill(
            id: String
            name: String
        ): [Skill]
    }

    type Mutation {
        createSkill(
            data: SkillInput!
        ): Skill
    }
`
module.exports = typeDefinition
