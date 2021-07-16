const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();
const getDataPromise = () => {
    return new Promise((resolve, reject) => {
        subscribers.add(resolve);
    });
};
const setDataPromisesResult = (result) => {
    subscribers.forEach((resolveCallback) => resolveCallback(result));
    subscribers.clear();
};

router.get('/subscribe', async (ctx, next) => {
    ctx.status = 200;
    ctx.body = await getDataPromise();
});

router.post('/publish', async (ctx, next) => {
    const message = ctx.request.body.message;
    if (!message) {
        ctx.throw(400, 'Message is empty');
    }
    setDataPromisesResult(message);
    ctx.status = 200;
    ctx.body = 'Published';
});

app.use(router.routes());

module.exports = app;
