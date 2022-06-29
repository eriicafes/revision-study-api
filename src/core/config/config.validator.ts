import { plainToClass } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsPositive, validateSync } from 'class-validator'

export class EnvironmentVariables {
  @IsNumber()
  @IsPositive()
  PORT!: number

  @IsNotEmpty()
  DATABASE_URL!: string

  @IsNotEmpty()
  APP_SECRET!: string

  @IsNumber()
  @IsPositive()
  TOKEN_LIFETIME_IN_DAYS!: number
}

export function validateConfig(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const configObj = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(configObj)

  if (errors.length > 0) {
    const errorMessages = errors.reduce((acc, error) => {
      return [...acc, ...Object.values(error.constraints || {})]
    }, [] as string[])
    console.log(
      'Configuration error:',
      errorMessages.map((e) => '\n* ' + e).join(''),
    )
    throw new Error('Configuration error')
  }

  return configObj
}
