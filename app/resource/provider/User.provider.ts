import HttpRequest from '../HttpRequest'
import type { IFindOneCurrentUserResponse } from '~/models/response/UserRes.model'

export interface IUserProvider {
  findOneCurrentUser (): Promise<IFindOneCurrentUserResponse>
}

class UserProvider extends HttpRequest implements IUserProvider {
  private urlPrefix: string = '/users'

  public async findOneCurrentUser (): Promise<IFindOneCurrentUserResponse> {
    this.setUserAuthHeader()
    const response = await this.get(`${this.urlPrefix}/myInfo`)
    return response
  }
}

export default UserProvider
