const typeDefinition = `
    type Skill {
        id: String
        name: String
        value: Int
    }
    
    type Hero {
        id: String
        name: String
        skills(id: String): [Skill]
    }
    input HeroInput {
        name: String
        skills: [String]
    }

    type Query {
        getHero(
            id: String
            name: String
        ): [Hero]
    }

    type Mutation {
        createHero(
            data: HeroInput!
        ): Hero
    }
`
module.exports = typeDefinition
