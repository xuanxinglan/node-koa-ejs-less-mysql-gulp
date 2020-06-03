const sm = require('sitemap');
const axios = require('../../libs/axios');
const {newsLishs} = require('../../config');
const {streamToPromise, SitemapStream} = require('sitemap')
module.exports = function (router) {

    router.get('/sitemap.xml', async ctx => {
        const sitemap = new SitemapStream({hostname: host});
        let {data: {data: newsLists = data}} = await axios(newsLishs, {
            "limit": 200,
            "page": 1,
            "title": "",
        })

        let urls;
        await newsLists.forEach((item) => {
            if(item.type.value == 1){
                urls = ({
                    url: `${host}/videoDetail?id=${item.id}`,
                    changefreq: 'daily',
                    lastmodrealtime: true,
                    priority: 1,
                    lastmod: new Date(item.publishTime)
                });

                sitemap.write(urls)

            }else if(item.type.value == 2){
                urls = ({
                    url: `${host}/specialDetail?id=${item.id}`,
                    changefreq: 'monthly',
                    lastmodrealtime: true,
                    priority: 0.6,
                    lastmod: new Date(item.publishTime)
                });

                sitemap.write(urls)
            }else {
                urls = ({
                    url: `${host}/detail?id=${item.id}`,
                    changefreq: 'daily',
                    lastmodrealtime: true,
                    priority: 1,
                    lastmod: new Date(item.publishTime)
                });
                sitemap.write(urls)

            }

        })

       sitemap.end()
       await streamToPromise(sitemap).then(buffer => {
           ctx.set('Content-Type', 'application/xml')
           let xml = buffer.toString()
           ctx.body = xml
       })

    });
};