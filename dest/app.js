"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appFactory = void 0;
const cors_1 = __importDefault(require("@koa/cors"));
const blockchain_1 = require("./../barretenberg.js/blockchain");
const bigint_buffer_1 = require("bigint-buffer");
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const koa_router_1 = __importDefault(require("koa-router"));
function appFactory(server, prefix) {
    const router = new koa_router_1.default({ prefix });
    const checkReady = async (ctx, next) => {
        if (!server.isReady()) {
            ctx.status = 503;
            ctx.body = { error: 'Server not ready.' };
        }
        else {
            await next();
        }
    };
    router.get('/', async (ctx) => {
        ctx.body = {
            serviceName: 'sriracha',
            isReady: server.isReady(),
        };
        ctx.response.status = 200;
    });
    router.get('/status', async (ctx) => {
        const status = await server.getStatus();
        ctx.set('content-type', 'application/json');
        ctx.body = {
            blockchainStatus: blockchain_1.blockchainStatusToJson(status.blockchainStatus),
        };
        ctx.response.status = 200;
    });
    router.get('/get-tree-state/:treeIndex', checkReady, async (ctx) => {
        const treeIndex = +ctx.params.treeIndex;
        const { size, root } = await server.getTreeState(treeIndex);
        const response = {
            root: root.toString('hex'),
            size: size.toString(),
        };
        ctx.set('content-type', 'application/json');
        ctx.body = response;
        ctx.response.status = 200;
    });
    router.get('/get-hash-path/:treeIndex/:index', checkReady, async (ctx) => {
        const index = BigInt(ctx.params.index);
        const treeIndex = +ctx.params.treeIndex;
        const path = await server.getHashPath(treeIndex, index);
        const response = {
            hashPath: path.toBuffer().toString('hex'),
        };
        ctx.set('content-type', 'application/json');
        ctx.body = response;
        ctx.response.status = 200;
    });
    router.post('/get-hash-paths/:treeIndex', checkReady, async (ctx) => {
        const additions = ctx.request.body.map((addition) => {
            return { index: bigint_buffer_1.toBigIntBE(Buffer.from(addition.index, 'hex')), value: Buffer.from(addition.value, 'hex') };
        });
        const treeIndex = +ctx.params.treeIndex;
        const { oldRoot, newRoots, newHashPaths, oldHashPaths } = await server.getHashPaths(treeIndex, additions);
        const response = {
            oldRoot: oldRoot.toString('hex'),
            newRoots: newRoots.map(r => r.toString('hex')),
            newHashPaths: newHashPaths.map(p => p.toBuffer().toString('hex')),
            oldHashPaths: oldHashPaths.map(p => p.toBuffer().toString('hex')),
        };
        ctx.set('content-type', 'application/json');
        ctx.body = response;
        ctx.response.status = 200;
    });
    const app = new koa_1.default();
    app.proxy = true;
    app.use(koa_compress_1.default());
    app.use(cors_1.default());
    app.use(koa_bodyparser_1.default());
    app.use(router.routes());
    app.use(router.allowedMethods());
    return app;
}
exports.appFactory = appFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxxREFBNkI7QUFDN0IsZ0VBQXlFO0FBQ3pFLGlEQUEyQztBQUMzQyw4Q0FBc0I7QUFDdEIsb0VBQXdDO0FBQ3hDLGdFQUFvQztBQUNwQyw0REFBZ0M7QUFJaEMsU0FBZ0IsVUFBVSxDQUFDLE1BQWMsRUFBRSxNQUFjO0lBQ3ZELE1BQU0sTUFBTSxHQUFHLElBQUksb0JBQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFFdEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxFQUFFLEdBQWdCLEVBQUUsSUFBeUIsRUFBRSxFQUFFO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDckIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLEtBQUssRUFBRSxtQkFBbUIsRUFBRSxDQUFDO1NBQzNDO2FBQU07WUFDTCxNQUFNLElBQUksRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDLENBQUM7SUFFRixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBZ0IsRUFBRSxFQUFFO1FBQ3pDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7WUFDVCxXQUFXLEVBQUUsVUFBVTtZQUN2QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRTtTQUMxQixDQUFDO1FBQ0YsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO0lBQzVCLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQWdCLEVBQUUsRUFBRTtRQUMvQyxNQUFNLE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN4QyxHQUFHLENBQUMsR0FBRyxDQUFDLGNB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