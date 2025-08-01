export type QueryDef = any;
// Primary key of Queue item
export type QueueId = string | number | bigint;
// This was used as a lock for Redis, deprecated.
export type ProcessingId = string | number | bigint;
export type QueryKey = (string | [string, any[]]) & {
  persistent?: true,
};
export type QueryKeyHash = string & { __type: 'QueryKeyHash' };

export type QueryKeysTuple = [keyHash: QueryKeyHash, queueId: QueueId | null /** Supported by new Cube Store and Memory */];
export type GetActiveAndToProcessResponse = [active: QueryKeysTuple[], toProcess: QueryKeysTuple[]];
export type AddToQueueResponse = [added: number, queueId: QueueId | null, queueSize: number, addedToQueueTime: number];
export type QueryStageStateResponse = [active: string[], toProcess: string[]] | [active: string[], toProcess: string[], defs: Record<string, QueryDef>];
export type RetrieveForProcessingSuccess = [
  added: unknown,
  // QueueId is required for Cube Store, other providers don't support it
  queueId: QueueId | null,
  active: QueryKeyHash[],
  pending: number,
  def: QueryDef,
  lockAquired: true
];
export type RetrieveForProcessingFail = [
  added: unknown,
  // QueueId is required for Cube Store, other providers don't support it
  queueId: QueueId | null,
  active: QueryKeyHash[],
  pending: number,
  def: null,
  lockAquired: false
];
export type RetrieveForProcessingResponse = RetrieveForProcessingSuccess | RetrieveForProcessingFail | null;

export interface AddToQueueQuery {
  isJob: boolean,
  orphanedTimeout: unknown
}

export interface AddToQueueOptions {
  // It's an ugly workaround for skip queue tasks
  queueId?: QueueId,
  stageQueryKey?: any,
  requestId: string,
  spanId?: string,
  orphanedTimeout?: number,
}

export interface QueueDriverOptions {
  redisQueuePrefix: string,
  concurrency: number,
  continueWaitTimeout: number,
  orphanedTimeout: number,
  heartBeatTimeout: number,
  processUid?: string;
}

export interface QueueDriverConnectionInterface {
  redisHash(queryKey: QueryKey): QueryKeyHash;
  getResultBlocking(queryKey: QueryKeyHash, queueId: QueueId): Promise<unknown>;
  getResult(queryKey: QueryKey): Promise<any>;
  /**
   * Adds specified by the queryKey query to the queue, returns tuple
   * with the operation result.
   *
   * @param keyScore Redis specific thing
   * @param queryKey
   * @param orphanedTime
   * @param queryHandler Our queue allows using different handlers. For example, query, cvsQuery, etc.
   * @param query
   * @param priority
   * @param options
   */
  addToQueue(keyScore: number, queryKey: QueryKey, orphanedTime: number, queryHandler: string, query: AddToQueueQuery, priority: number, options: AddToQueueOptions): Promise<AddToQueueResponse>;
  // Return query keys which was sorted by priority and time
  getToProcessQueries(): Promise<QueryKeysTuple[]>;
  getActiveQueries(): Promise<QueryKeysTuple[]>;
  getQueryDef(hash: QueryKeyHash, queueId: QueueId | null): Promise<QueryDef | null>;
  // Queries which was added to queue, but was not processed and not needed
  getOrphanedQueries(): Promise<QueryKeysTuple[]>;
  // Queries which was not completed with old heartbeat
  getStalledQueries(): Promise<QueryKeysTuple[]>;
  getQueryStageState(onlyKeys: boolean): Promise<QueryStageStateResponse>;
  updateHeartBeat(hash: QueryKeyHash, queueId: QueueId | null): Promise<void>;
  getNextProcessingId(): Promise<ProcessingId>;
  // Trying to acquire a lock for processing a queue item, this method can return null when
  // multiple nodes tries to process the same query
  retrieveForProcessing(hash: QueryKeyHash, processingId: ProcessingId): Promise<RetrieveForProcessingResponse>;
  freeProcessingLock(hash: QueryKeyHash, processingId: ProcessingId, activated: unknown): Promise<void>;
  optimisticQueryUpdate(hash: QueryKeyHash, toUpdate: unknown, processingId: ProcessingId, queueId: QueueId | null): Promise<boolean>;
  cancelQuery(queryKey: QueryKey, queueId: QueueId | null): Promise<QueryDef | null>;
  getQueryAndRemove(hash: QueryKeyHash, queueId: QueueId | null): Promise<[QueryDef]>;
  setResultAndRemoveQuery(hash: QueryKeyHash, executionResult: any, processingId: ProcessingId, queueId: QueueId | null): Promise<unknown>;
  release(): void;
  //
  getQueriesToCancel(): Promise<QueryKeysTuple[]>
  // @deprecated
  getActiveAndToProcess(): Promise<GetActiveAndToProcessResponse>;
}

export interface QueueDriverInterface {
  redisHash(queryKey: QueryKey): QueryKeyHash;
  createConnection(): Promise<QueueDriverConnectionInterface>;
  release(connection: QueueDriverConnectionInterface): void;
}
