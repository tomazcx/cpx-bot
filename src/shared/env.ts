import 'dotenv/config'

export class Env {
  static get RU_URL(): string {
    return process.env.RU_URL;
  }

  static get VERAS_URL():string{
    return process.env.VERAS_URL;
  }

  static get VERAS_EMAIL():string{
    return process.env.VERAS_EMAIL;
  }

  static get VERAS_PASSWORD():string{
    return process.env.VERAS_PASSWORD;
  }
}
