local cjson = require("cjson")

local plugins = {
    "ai-proxy",
    "ai-proxy-multi",
    "ai-rag",
    "ai-prompt-decorator",
    "ai-prompt-guard",
    "ai-prompt-template",
    "ai-rate-limiting",
    "ai-request-rewrite",
    "ai-aliyun-content-moderation",
    "ai-aws-content-moderation",
    "attach-consumer-label",
    "body-transformer",
    "brotli",
    "chaitin-waf",
    "degraphql",
    "gm",
    "http-dubbo",
    "inspect",
    "jwe-decrypt",
    "lago",
    "loki-logger",
    "mcp-bridge",
    "multi-auth",
    "ocsp-stapling",
    "workflow",
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
    else
        io.stderr:write("failed to load " .. name .. ": " .. tostring(plugin_obj) .. "\n")
    end
end

print(cjson.encode(res))
