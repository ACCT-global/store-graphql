import { RequestOptions } from 'apollo-datasource-rest'
import { forEachObjIndexed } from 'ramda'

import { RESTDataSource } from './RESTDataSource'

interface AggregationsArgs {
  schema: string
  where: string
  field: string
  type: string
  interval: string
}

interface SubscriptionsOrdersArgs {
  where: string
  schema: string
  fields: string
}

export class SubscriptionsDataSource extends RESTDataSource {
  public subscriptionsAggregations = ({ schema, where, field, type, interval }: AggregationsArgs) => {
    const { vtex: { account } } = this.context

    return this.get(
      `subscriptions/aggregations?an=${account}&_schema=${schema}&_where=${where}&_field=${field}&_type=${type}&_interval=${interval}`,
      undefined,
      {metric: 'masterdata-subscriptionsAggregations'}
    )
  }

  public getSubscriptionsOrders = ({ where, schema, fields }: SubscriptionsOrdersArgs) => {
    const { vtex: { account } } = this.context

    return this.get(
      `subscription_orders/search/?an=${account}&_fields=${fields}&_schema=${schema}${where ? `&_where=${where}` : ''}`,
      undefined,
      {metric: 'masterdata-getSubscriptionsOrders'}
    )
  }

  public getSubscriptionsOrdersAggregations = ({ schema, where, field, type, interval }: AggregationsArgs) => {
    const { vtex: { account } } = this.context

    return this.get(
      `subscription_orders/aggregations?an=${account}&_schema=${schema}&_where=${where}&_field=${field}&_type=${type}&_interval=${interval}`,
      undefined,
      {metric: 'masterdata-getSubscriptionsOrdersAggregations'}
    )
  }

  get baseURL() {
    return `http://api.vtex.com/api/dataentities`
  }

  protected willSendRequest(request: RequestOptions) {
    const { vtex: { authToken } } = this.context

    forEachObjIndexed(
      (value: string, header) => request.headers.set(header, value),
      {
        'Proxy-Authorization': authToken,
        'VtexIdclientAutCookie': authToken,
        'X-Vtex-Proxy-To': `https://api.vtex.com`,
      }
    )
  }
}