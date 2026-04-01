local cjson = require("cjson")

local plugins = {
"ai-aliyun-content-moderation","ai-aws-content-moderation","ai-prompt-decorator","ai-prompt-guard","ai-prompt-template","ai-proxy-multi","ai-proxy","ai-rag","ai-rate-limiting","ai-request-rewrite","ai","api-breaker","attach-consumer-label","authz-casbin","authz-casdoor","authz-keycloak","aws-lambda","azure-functions","basic-auth","batch-requests","body-transformer","brotli","cas-auth","chaitin-waf","clickhouse-logger","client-control","consumer-restriction","cors","csrf","datadog","degraphql","dubbo-proxy","echo","elasticsearch-logger","error-log-logger","example-plugin","ext-plugin-post-req","ext-plugin-post-resp","ext-plugin-pre-req","fault-injection","file-logger","forward-auth","gm","google-cloud-logging","grpc-transcode","grpc-web","gzip","hmac-auth","http-dubbo","http-logger","inspect","ip-restriction","jwe-decrypt","jwt-auth","kafka-logger","kafka-proxy","key-auth","lago","ldap-auth","limit-conn","limit-count","limit-req","log-rotate","loggly","loki-logger","mcp-bridge","mocking","multi-auth","node-status","ocsp-stapling","opa","openfunction","openid-connect","opentelemetry","openwhisk","prometheus","proxy-control","proxy-mirror","proxy-rewrite","public-api","real-ip","redirect","referer-restriction","request-id","request-validation","response-rewrite","rocketmq-logger","server-info","serverless-post-function","serverless-pre-function","skywalking-logger","skywalking","sls-logger","splunk-hec-logging","syslog","tcp-logger","tencent-cloud-cls","traffic-split","ua-restriction","udp-logger","uri-blocker","wolf-rbac","workflow","zipkin"
}

-- Mock dependencies
local function mock(name, tbl)
    package.preload[name] = function()
        return tbl
    end
end

local core = {
    schema = {
        check = function() return true end,
        TYPE_METADATA = "metadata",
        TYPE_CONSUMER = "consumer",
    },
    table = {
        insert = table.insert,
        concat = table.concat,
        pick = function(t, attrs) return t end,
        try_read_attr = function(t, ...)
            local path = {...}
            local val = t
            for _, k in ipairs(path) do
                if type(val) ~= "table" then return nil end
                val = val[k]
            end
            return val
        end,
        clone = function(t) return t end,
        deepcopy = function(t) return t end,
        nkeys = function(t)
            local n = 0
            for _ in pairs(t) do n = n + 1 end
            return n
        end,
        clear = function(t) for k in pairs(t) do t[k] = nil end end,
        new = function() return {} end,
    },
    json = {
        encode = cjson.encode,
        decode = cjson.decode,
        delay_encode = function(t) return t end,
        stably_encode = cjson.encode,
    },
    log = {
        info = function() end,
        warn = function() end,
        error = function() end,
        debug = function() end,
    },
    config = {
        local_conf = function() return { plugins = {}, stream_plugins = {} } end
    },
    utils = {
        parse_addr = function() return "127.0.0.1", 80 end
    },
    lrucache = function() return function() end end,
    response = {
        exit = function() end
    }
}

mock("apisix.core", core)
mock("apisix.core.json", core.json)
mock("apisix.core.table", core.table)
mock("apisix.core.log", core.log)
mock("apisix.core.lrucache", core.lrucache)
mock("apisix.core.response", core.response)

-- Mock schema_def as it is often used
local schema_def = {
    health_checker_active = { type = "object" },
    route = { type = "object" },
    upstream = { type = "object" },
    service = { type = "object" },
    consumer = { type = "object" },
    ssl = { type = "object" },
    global_rule = { type = "object" },
    plugin_config = { type = "object" },
    proto = { type = "object" },
    stream_route = { type = "object" },
    consumer_group = { type = "object" },
    secret = { type = "object" },
}
mock("apisix.schema_def", schema_def)

-- Mock ai-drivers schema
local ai_drivers_schema = {
    providers = { "openai", "deepseek", "anthropic", "gemini", "vertex-ai", "azure-openai" }
}
mock("apisix.plugins.ai-drivers.schema", ai_drivers_schema)

-- Mock resty.*
mock("resty.http", { new = function() return {} end })
mock("resty.radixtree", { new = function() return {} end })
mock("resty.roundrobin", { new = function() return {} end })
mock("resty.expr.v1", { new = function() return {} end })
mock("resty.limit.conn", { new = function() return {} end })
mock("resty.limit.count", { new = function() return {} end })
mock("resty.limit.req", { new = function() return {} end })
mock("graphql", { parse = function() end })
mock("lyaml", { load = function() end })
mock("prometheus", { new = function() return {} end })
mock("xml2lua", { parse = function() end })
mock("socket.url", { parse = function() end })
mock("resty.aws.config", { new = function() return {} end })
mock("jsonschema", { generate = function() end })
mock("resty.dns.resolver", { new = function() return {} end })
mock("resty.expr.v1", { new = function() return {} end })
mock("resty.aes", { new = function() return {} end })
mock("resty.cookie", { new = function() return {} end })
mock("resty.jwt", { sign = function() end, verify = function() end })
mock("resty.openidc", { authenticate = function() end })
mock("resty.hmac", { new = function() return {} end })
mock("resty.sha256", { new = function() return {} end })
mock("resty.lrucache", { new = function() return {} end })

local res = {}

for _, name in ipairs(plugins) do
    local ok, plugin_obj = pcall(require, "apisix.plugins." .. name)
    if ok and plugin_obj then
        res[name] = {
            schema = plugin_obj.schema,
            consumer_schema = plugin_obj.consumer_schema,
            metadata_schema = plugin_obj.metadata_schema,
            priority = plugin_obj.priority,
            type = plugin_obj.type or "other",
            version = plugin_obj.version,
        }
    end
end

print(cjson.encode(res))
