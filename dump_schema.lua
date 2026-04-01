local core = require("apisix.core")
local plugin = require("apisix.plugin")
local schema_def = require("apisix.schema_def")
local json = require("apisix.core.json")

local function get_plugins()
    local http_plugins = core.config.local_conf().plugins
    local stream_plugins = core.config.local_conf().stream_plugins
    return http_plugins, stream_plugins
end

local function dump()
    local http_plugins, stream_plugins = get_plugins()
    local res = {
        main = {
            route = schema_def.route,
            upstream = schema_def.upstream,
            service = schema_def.service,
            consumer = schema_def.consumer,
            ssl = schema_def.ssl,
            global_rule = schema_def.global_rule,
            plugin_config = schema_def.plugin_config,
            proto = schema_def.proto,
            stream_route = schema_def.stream_route,
            consumer_group = schema_def.consumer_group,
            secret = schema_def.secret,
        },
        plugins = {}
    }

    local function add_plugins(plugins, is_stream)
        if not plugins then return end
        for _, name in ipairs(plugins) do
            local ok, plugin_obj = pcall(require, "apisix.plugins." .. name)
            if ok and plugin_obj then
                local p_schema = {
                    schema = plugin_obj.schema,
                    consumer_schema = plugin_obj.consumer_schema,
                    metadata_schema = plugin_obj.metadata_schema,
                    priority = plugin_obj.priority,
                    type = plugin_obj.type,
                }
                res.plugins[name] = p_schema
            end
        end
    end

    add_plugins(http_plugins, false)
    add_plugins(stream_plugins, true)

    print(json.encode(res, true))
end

dump()
