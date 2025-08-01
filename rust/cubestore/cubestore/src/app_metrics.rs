//! We keep all CubeStore metrics in one place for discoverability.
//! The convention is to prefix all metrics with `cs.` (short for CubeStore).

use crate::util::metrics;
use crate::util::metrics::{Counter, Gauge, Histogram};

/// The number of process startups.
pub static STARTUPS: Counter = metrics::counter("cs.startup");

/// Errors in IPC.
pub static WORKER_POOL_ERROR: Counter = metrics::counter("cs.worker_pool.errors");

/// Incoming SQL queries that do data reads.
pub static DATA_QUERIES: Counter = metrics::counter("cs.sql.query.data");
pub static DATA_QUERIES_CACHE_HIT: Counter = metrics::counter("cs.sql.query.data.cache.hit");
// Approximate number of entries in this cache.
pub static DATA_QUERIES_CACHE_SIZE: Gauge = metrics::gauge("cs.sql.query.data.cache.size");
// Approximate total weighted size of entries in this cache.
pub static DATA_QUERIES_CACHE_WEIGHT: Gauge = metrics::gauge("cs.sql.query.data.cache.weight");
pub static DATA_QUERY_TIME_MS: Histogram = metrics::histogram("cs.sql.query.data.ms");
/// Incoming SQL queries that only read metadata or do trivial computations.
pub static META_QUERIES: Counter = metrics::counter("cs.sql.query.meta");
pub static META_QUERY_TIME_MS: Histogram = metrics::histogram("cs.sql.query.meta.ms");
/// Incoming cache queries.
pub static CACHE_QUERIES: Counter = metrics::counter("cs.sql.query.cache");
pub static CACHE_QUERY_TIME_MS: Histogram = metrics::histogram("cs.sql.query.cache.ms");
/// Incoming queue queries.
pub static QUEUE_QUERIES: Counter = metrics::counter("cs.sql.query.queue");
pub static QUEUE_QUERY_TIME_MS: Histogram = metrics::histogram("cs.sql.query.queue.ms");
pub static STREAMING_ROWS_READ: Counter = metrics::counter("cs.streaming.rows");
pub static STREAMING_CHUNKS_READ: Counter = metrics::counter("cs.streaming.chunks");
pub static STREAMING_LASTOFFSET: Gauge = metrics::gauge("cs.streaming.lastoffset");
pub static IN_MEMORY_CHUNKS_COUNT: Gauge = metrics::gauge("cs.workers.in_memory_chunks)");
pub static IN_MEMORY_CHUNKS_ROWS: Gauge = metrics::gauge("cs.workers.in_memory_chunks.rows)");
pub static IN_MEMORY_CHUNKS_MEMORY: Gauge = metrics::gauge("cs.workers.in_memory_chunks.memory)");
pub static STREAMING_IMPORT_TIME: Histogram = metrics::histogram("cs.streaming.import_time.ms");
pub static STREAMING_PARTITION_TIME: Histogram =
    metrics::histogram("cs.streaming.partition_time.ms");
pub static STREAMING_UPLOAD_TIME: Histogram = metrics::histogram("cs.streaming.upload_time.ms");
pub static STREAMING_ROUNDTRIP_TIME: Histogram =
    metrics::histogram("cs.streaming.roundtrip_time.ms");
pub static STREAMING_ROUNDTRIP_ROWS: Histogram = metrics::histogram("cs.streaming.roundtrip_rows");
pub static STREAMING_ROUNDTRIP_CHUNKS: Histogram =
    metrics::histogram("cs.streaming.roundtrip_chunks");
pub static STREAMING_LAG: Gauge = metrics::gauge("cs.streaming.lag");

pub static METASTORE_QUEUE: Gauge = metrics::gauge("cs.metastore.queue_size");
pub static METASTORE_READ_OPERATION: Histogram =
    metrics::histogram("cs.metastore.read_operation.ms");
pub static METASTORE_INNER_READ_OPERATION: Histogram =
    metrics::histogram("cs.metastore.inner_read_operation.ms");
pub static METASTORE_WRITE_OPERATION: Histogram =
    metrics::histogram("cs.metastore.write_operation.ms");
pub static METASTORE_INNER_WRITE_OPERATION: Histogram =
    metrics::histogram("cs.metastore.inner_write_operation.ms");
pub static METASTORE_READ_OUT_QUEUE_OPERATION: Histogram =
    metrics::histogram("cs.metastore.read_out_queue_operation.ms");

pub static CACHESTORE_ROCKSDB_ESTIMATE_LIVE_DATA_SIZE: Gauge =
    metrics::gauge("cs.cachestore.rocksdb.estimate_live_data_size");
pub static CACHESTORE_ROCKSDB_LIVE_SST_FILES_SIZE: Gauge =
    metrics::gauge("cs.cachestore.rocksdb.live_sst_files_size");
pub static CACHESTORE_ROCKSDB_CF_DEFAULT_SIZE: Gauge =
    metrics::gauge("cs.cachestore.rocksdb.cf.default.size");
pub static CACHESTORE_SCHEDULER_GC_QUEUE: Gauge =
    metrics::gauge("cs.cachestore.scheduler.gc_queue");

/// RemoteFs metrics
pub static REMOTE_FS_OPERATION_CORE: Counter = metrics::counter("cs.remote_fs.operations.core");
pub static REMOTE_FS_FILES_TO_REMOVE: Gauge = metrics::gauge("cs.remote_fs.files_to_remove.count");
pub static REMOTE_FS_FILES_SIZE_TO_REMOVE: Gauge =
    metrics::gauge("cs.remote_fs.files_to_remove.size");

/// Cache Store Cache
pub static CACHESTORE_TTL_PERSIST: Counter = metrics::counter("cs.cachestore.ttl.persist");
pub static CACHESTORE_TTL_BUFFER: Gauge = metrics::gauge("cs.cachestore.ttl.buffer");
// Cache Store Eviction
pub static CACHESTORE_EVICTION_REMOVED_EXPIRED_KEYS: Counter =
    metrics::counter("cs.cachestore.eviction.expired.keys");
pub static CACHESTORE_EVICTION_REMOVED_EXPIRED_SIZE: Counter =
    metrics::counter("cs.cachestore.eviction.expired.size");
pub static CACHESTORE_EVICTION_REMOVED_KEYS: Counter =
    metrics::counter("cs.cachestore.eviction.removed.keys");
pub static CACHESTORE_EVICTION_REMOVED_SIZE: Counter =
    metrics::counter("cs.cachestore.eviction.removed.size");
