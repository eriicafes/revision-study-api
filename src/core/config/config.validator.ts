import { plainToClass } from "class-transformer";
import { IsNotEmpty, validateSync } from "class-validator";

export class EnvironmentVariables {
    @IsNotEmpty()
    DATABASE_URL: string
}

export function validateConfig(config: Record<string, unknown>): EnvironmentVariables {
    const configObj = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true })

    const errors = validateSync(configObj)

    if (errors.length > 0) {
        const errorMessages = errors.reduce((acc, error) => {
            return [...acc, ...Object.values(error.constraints)]
        }, [])
        console.log("Configuration error:", errorMessages.map(e => "\n* " + e).join(""))
        throw new Error("Configuration error")
    }

    return configObj
}
