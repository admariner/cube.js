import { Required, SchemaFileRepository } from '@cubejs-backend/shared';
import {
  CheckAuthFn,
  ExtendContextFn,
  JWTOptions,
  UserBackgroundContext,
  QueryRewriteFn,
  CheckSQLAuthFn,
  CanSwitchSQLUserFn,
  ContextToApiScopesFn,
} from '@cubejs-backend/api-gateway';
import { BaseDriver, CacheAndQueryDriverType } from '@cubejs-backend/query-orchestrator';
import { BaseQuery } from '@cubejs-backend/schema-compiler';

export interface QueueOptions {
  concurrency?: number;
  continueWaitTimeout?: number;
  executionTimeout?: number;
  orphanedTimeout?: number;
  heartBeatInterval?: number;
}

export interface QueryCacheOptions {
  refreshKeyRenewalThreshold?: number;
  backgroundRenew?: boolean;
  queueOptions?: QueueOptions | ((dataSource: string) => QueueOptions);
  externalQueueOptions?: QueueOptions;
}

/**
 * This interface describes properties users could use to configure
 * pre-aggregations in the cube.js file.
 */
export interface PreAggregationsOptions {
  queueOptions?: QueueOptions | ((dataSource: string) => QueueOptions);
  externalRefresh?: boolean;

  /**
   * The maximum number of partitions that pre-aggregation can have. Uses
   * CUBEJS_MAX_PARTITIONS_PER_CUBE environment variable as the default value.
   */
  maxPartitions?: number;
}

export interface OrchestratorOptions {
  redisPrefix?: string;
  queryCacheOptions?: QueryCacheOptions;
  preAggregationsOptions?: PreAggregationsOptions;
  rollupOnlyMode?: boolean;
  testConnectionTimeout?: number;
}

export interface QueueInitedOptions {
  concurrency: number;
  continueWaitTimeout?: number;
  executionTimeout?: number;
  orphanedTimeout?: number;
  heartBeatInterval?: number;
}

export interface QueryInitedOptions {
  queueOptions: (dataSource: string) => Promise<QueueInitedOptions>;
  refreshKeyRenewalThreshold?: number;
  backgroundRenew?: boolean;
  externalQueueOptions?: QueueOptions;
}

export interface AggsInitedOptions {
  queueOptions?: (dataSource: string) => Promise<QueueInitedOptions>;
  externalRefresh?: boolean;
}

export interface OrchestratorInitedOptions {
  queryCacheOptions: QueryInitedOptions;
  preAggregationsOptions: AggsInitedOptions;
  redisPrefix?: string;
  rollupOnlyMode?: boolean;
  testConnectionTimeout?: number;
}

export interface RequestContext {
  // @deprecated Renamed to securityContext, please use securityContext.
  authInfo?: any;
  securityContext: any;
  requestId: string;
}

export interface DriverContext extends RequestContext {
  dataSource: string;
}

export interface DialectContext extends DriverContext {
  dbType: string;
}

export interface DriverFactory {}

export type DatabaseType =
  | 'cubestore'
  | 'athena'
  | 'bigquery'
  | 'clickhouse'
  | 'crate'
  | 'druid'
  | 'jdbc'
  | 'firebolt'
  | 'hive'
  | 'mongobi'
  | 'mssql'
  | 'mysql'
  | 'elasticsearch'
  | 'awselasticsearch'
  | 'oracle'
  | 'postgres'
  | 'prestodb'
  | 'redshift'
  | 'snowflake'
  | 'sqlite'
  | 'questdb'
  | 'materialize'
  | 'pinot';

export type ContextToAppIdFn = (context: RequestContext) => string | Promise<string>;
export type ContextToRolesFn = (context: RequestContext) => string[] | Promise<string[]>;
export type ContextToOrchestratorIdFn = (context: RequestContext) => string | Promise<string>;
export type ContextToCubeStoreRouterIdFn = (context: RequestContext) => string | Promise<string>;

export type OrchestratorOptionsFn = (context: RequestContext) => OrchestratorOptions | Promise<OrchestratorOptions>;

export type PreAggregationsSchemaFn = (context: RequestContext) => string | Promise<string>;

export type ScheduledRefreshTimeZonesFn = (context: RequestContext) => string[] | Promise<string[]>;

/**
 * Function that should provide a logic of scheduled returning of
 * the user background context. Used as a part of a main
 * configuration object of the Gateway to provide extendability to
 * this logic.
 */
export type ScheduledRefreshContextsFn = () => Promise<UserBackgroundContext[]>;

// internal
export type DriverOptions = {
  dataSource?: string,
  maxPoolSize?: number,
  testConnectionTimeout?: number,
};

export type DriverConfig = {
  type: DatabaseType,
} & DriverOptions;

export type DbTypeFn = (context: DriverContext) =>
  DatabaseType | Promise<DatabaseType>;
export type DriverFactoryFn = (context: DriverContext) =>
  Promise<BaseDriver | DriverConfig> | BaseDriver | DriverConfig;

export type DbTypeAsyncFn = (context: DriverContext) =>
  Promise<DatabaseType>;
export type DriverFactoryAsyncFn = (context: DriverContext) =>
  Promise<BaseDriver | DriverConfig>;

export type DialectFactoryFn = (context: DialectContext) => BaseQuery;

// external
export type ExternalDbTypeFn = (context: RequestContext) => DatabaseType;
export type ExternalDriverFactoryFn = (context: RequestContext) => Promise<BaseDriver> | BaseDriver;
export type ExternalDialectFactoryFn = (context: RequestContext) => BaseQuery;

export type LoggerFnParams = {
  // It's possible to fill timestamp at the place of logging, otherwise, it will be filled in automatically
  timestamp?: string,
  [key: string]: any,
};
export type LoggerFn = (msg: string, params: LoggerFnParams) => void;

export type BiToolSyncConfig = {
  type: string;
  active?: boolean;
  config: Record<string, any>;
};

export interface CreateOptions {
  dbType?: DatabaseType | DbTypeFn;
  externalDbType?: DatabaseType | ExternalDbTypeFn;
  schemaPath?: string;
  basePath?: string;
  devServer?: boolean;
  apiSecret?: string;
  logger?: LoggerFn;
  driverFactory?: DriverFactoryFn;
  dialectFactory?: DialectFactoryFn;
  externalDriverFactory?: ExternalDriverFactoryFn;
  externalDialectFactory?: ExternalDialectFactoryFn;
  cacheAndQueueDriver?: CacheAndQueryDriverType;
  contextToAppId?: ContextToAppIdFn;
  contextToRoles?: ContextToRolesFn;
  contextToOrchestratorId?: ContextToOrchestratorIdFn;
  contextToCubeStoreRouterId?: ContextToCubeStoreRouterIdFn;
  contextToApiScopes?: ContextToApiScopesFn;
  repositoryFactory?: (context: RequestContext) => SchemaFileRepository;
  checkAuth?: CheckAuthFn;
  checkSqlAuth?: CheckSQLAuthFn;
  canSwitchSqlUser?: CanSwitchSQLUserFn;
  jwt?: JWTOptions;
  gatewayPort?: number;
  // @deprecated Please use queryRewrite
  queryTransformer?: QueryRewriteFn;
  queryRewrite?: QueryRewriteFn;
  preAggregationsSchema?: string | PreAggregationsSchemaFn;
  schemaVersion?: (context: RequestContext) => string | Promise<string>;
  extendContext?: ExtendContextFn;
  scheduledRefreshTimer?: boolean | number;
  scheduledRefreshTimeZones?: string[] | ScheduledRefreshTimeZonesFn;
  scheduledRefreshContexts?: () => Promise<UserBackgroundContext[]>;
  scheduledRefreshConcurrency?: number;
  scheduledRefreshBatchSize?: number;
  compilerCacheSize?: number;
  maxCompilerCacheKeepAlive?: number;
  updateCompilerCacheKeepAlive?: boolean;
  telemetry?: boolean;
  allowUngroupedWithoutPrimaryKey?: boolean;
  orchestratorOptions?: OrchestratorOptions | OrchestratorOptionsFn;
  allowJsDuplicatePropsInSchema?: boolean;
  // @deprecated Use contextToOrchestratorId instead.
  contextToDataSourceId?: any;
  dashboardAppPath?: string;
  dashboardAppPort?: number;
  sqlCache?: boolean;
  livePreview?: boolean;
  // Internal flag, that we use to detect serverless env
  serverless?: boolean;
  allowNodeRequire?: boolean;
  semanticLayerSync?: (context: RequestContext) => Promise<BiToolSyncConfig[]> | BiToolSyncConfig[];
  fastReload?: boolean;
}

export interface DriverDecoratedOptions extends CreateOptions {
  dbType: DbTypeAsyncFn;
  driverFactory: DriverFactoryAsyncFn;
}

export type ServerCoreInitializedOptions = Required<
  DriverDecoratedOptions,
  'dbType' |
  'apiSecret' |
  'devServer' |
  'telemetry' |
  'dashboardAppPath' |
  'dashboardAppPort' |
  'schemaPath' |
  'driverFactory' |
  'dialectFactory' |
  'externalDriverFactory' |
  'externalDialectFactory' |
  'scheduledRefreshContexts'
>;

export type SystemOptions = {
  isCubeConfigEmpty: boolean;
};

// Types to support the ContextAcceptance mechanism
export type ContextAcceptanceResult = {
  accepted: boolean;
};

export type ContextAcceptanceResultHttp = ContextAcceptanceResult & {
  rejectHeaders?: { [key: string]: string };
  rejectStatusCode?: number;
};

export type ContextAcceptanceResultWs = ContextAcceptanceResult & {
  rejectMessage?: any;
};

export interface ContextAcceptor {
  shouldAccept(context: RequestContext | null): Promise<ContextAcceptanceResult> | ContextAcceptanceResult;
  shouldAcceptHttp(context: RequestContext | null): Promise<ContextAcceptanceResultHttp> | ContextAcceptanceResultHttp;
  shouldAcceptWs(context: RequestContext | null): Promise<ContextAcceptanceResultWs> | ContextAcceptanceResultWs;
}
