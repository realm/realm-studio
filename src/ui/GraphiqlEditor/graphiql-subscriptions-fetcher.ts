// Heavily modified from https://github.com/apollographql/GraphiQL-Subscriptions-Fetcher

import { parse } from 'graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const hasSubscriptionOperation = (graphQlParams: any) => {
  const queryDoc = parse(graphQlParams.query);

  for (const definition of queryDoc.definitions) {
    if (definition.kind === 'OperationDefinition') {
      const operation = definition.operation;
      if (operation === 'subscription') {
        return true;
      }
    }
  }

  return false;
};

export const createGraphQLFetcher = (params: {
  url: string;
  getToken: () => string;
}) => {
  const wsUrl = new URL(params.url);
  switch (wsUrl.protocol) {
    case 'http:':
      wsUrl.protocol = 'ws:';
      break;
    case 'https:':
      wsUrl.protocol = 'wss:';
      break;
  }

  const subscriptionsClient = new SubscriptionClient(wsUrl.toString(), {
    reconnect: true,
    connectionParams: { token: params.getToken() },
  });
  let activeSubscription: { unsubscribe: () => void } | null = null;

  const fetchWS = (graphQLParams: any) => {
    return {
      subscribe: (observer: {
        error: (error: Error) => void;
        next: (value: any) => void;
      }) => {
        observer.next(
          'Your subscription data will appear here after server publication!',
        );

        activeSubscription = subscriptionsClient
          .request({
            query: graphQLParams.query,
            variables: graphQLParams.variables,
          })
          .subscribe(observer);
      },
    };
  };

  const fetchHttp = async (graphQLParams: any) => {
    const response = await fetch(params.url, {
      method: 'post',
      headers: {
        Authorization: params.getToken(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphQLParams),
    });
    return response.json();
  };

  return (graphQLParams: any) => {
    if (activeSubscription !== null) {
      activeSubscription.unsubscribe();
    }

    if (subscriptionsClient && hasSubscriptionOperation(graphQLParams)) {
      return fetchWS(graphQLParams);
    }

    return fetchHttp(graphQLParams);
  };
};
