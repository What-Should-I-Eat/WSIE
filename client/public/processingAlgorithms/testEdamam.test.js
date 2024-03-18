/**
 * @jest-environment jsdom
 */

const edamam = require("./edamam");
beforeEach(() => {
    jest.clearAllMocks();
    global.currentUser = require('./currentUser');
    global.currentUser.getUserNameFromCookie = require('./currentUser');
    global.currentUser.getUserNameFromCookie = jest.fn().mockReturnValue('test');
    global.getUserId = jest.fn().mockReturnValue('65b5009e3ff7a8a24a418ed4');
    global.getUserData = jest.fn().mockReturnValue(() => Promise.resolve({
        "_id": "65b5009e3ff7a8a24a418ed4",
        "fullName": "Emmeline",
        "userName": "Emmeline",
        "password": "$2a$10$MCoGfTfPk0wdxGHa3xHjSeood9hvfMN5Zy.SC4OFTlQEaglWHNU2C",
        "email": "emmeline.pearson@gmail.com",
        "diet": [],
        "health": [
            "dairy-free"
        ],
        "favorites": [
            {
                "recipeName": "Apple Slaw",
                "recipeIngredients": [
                    "1 granny smith apple",
                    "1 tablespoon fresh lemon juice",
                    "1.5 cups red cabbage",
                    "1.25 cups green cabbage",
                    "1 beet",
                    ".5 cups rice vinegar",
                    ".25 cups apple cider vinegar",
                    "2 teaspoons dijon mustard",
                    "1 cup olive oil"
                ],
                "recipeDirections": [
                    "Core and thinly slice the apple, unpeeled. Toss with lemon juice in a large bowl., Remove outer layers of cabbages and use a large knife to thinly slice into ribbons. Add to apples., Wash and grate (with the large holes) the raw beet. Add to apples and cabbage., Whisk together the vinegars, mustard, and olive oil. Pour over the slaw and toss well. Season with salt and freshly ground pepper if needed. The flavors age nicely if you have the time to let this sit for an hour or two-- or more."
                ],
                "recipeImage": "https://edamam-product-images.s3.amazonaws.com/web-img/a3a/a3ad2b6121c0d0e0d750b3b3879e6a52-l.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEAYaCXVzLWVhc3QtMSJGMEQCIEWYyCbKJji0VhBRw%2FJUDT7Poh00M0R3%2FvSwywaZTg0XAiAbuIIm%2B4kAjVQw%2FhjBRLO7sVsVKIlNHD6VX1zuke38%2FSrBBQi%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMJ8RB8bHprK9CL7%2BuKpUF2boyEqgApcFGValGsBKlFBWTmTYDDME4Fxyr8NpsmCNRdSbVjnJq3GkgSXksT5TPgWjqo%2BxOL2iLXXbWbDVSXJQKU7vuRi59ChrU%2FDEkAGwBZmWC0sxIDBZsDns1tq%2FKZeyS7uVvbVgCfNl3YUZ9Z5uonifNsdjClALPydMP8fkO7FLSgFnN%2FzhZGTSd5PoqhODailEMOjCacDZHIOtDniFe9E3BVzGJ%2BiTrvIOWrQdbzpyJcHlmMNGuFicj9dbAsJA2Thgu1ZmGipXVC%2BN2dj1eZVp0LwSWg7PT6JIoao4fyi%2BGxu5s8jV9pLBFexFztFahSeW3wLwfwFn4cCC5YHdQZFO5I7VYoymIFsc59dTjI8T8TKFeCqk22KavASS%2BMaTvBNWfIK6PtoP9kA92Ooafg2n42HQ7ezH20GrTWXpkysHf3LDGL%2BDUPxNz%2FlzopmF39zQMlMmQ1KYrFQ0HYWbyaZRfZw%2FVIHS90EW2akSILgHtCkYDJOHCUIKEmGshefBZWPESRQC6ydDdRX%2F0NJPjoSvO5HKoAFWHetUTGu3ZIwFxsUNV8PUqE0wc0UU7lQIknmkDK%2FUeM3RuPyQkxsz1dnrhJbXqMZu1EVcDq4s0yo6ujJ75kK3iqQGkR8z7jX9KbeV%2B0Ux8VvL0tg%2FeYvXXOys4wZr70zDEjrxA1LuxxRVvQDUhRsMTBO1eCiDM%2BUsnCzNpYim1PiIGEfaxfkwEtiJx3%2FH9cHy3HRXl8iB9e41ijlm1j5vvg63pKQs3kZHpTWnuJCc1WZsI%2F97iug5S%2BBTIcpUEfCMhT96PX2yYHht5pf8b0dYy7uLa4YhpsdyK2oQaVmgiATsbrAssWWuENhWxqqKSqMsYtffVlFkAjKIAjDCEk9StBjqyAZA%2BkyRvOEvU0oiC5TjCJSH4wrSUMGhIzPLgtXvdqVN3%2BXReM3z0svg4C1Ck81P3shKy3ZyTCXj7baYuWMmYU50EP%2F78GD4wIw0rFxSW132uiZN6fKqfm4gErvp6mCCA05cD59ar9kbxHN55lwBH3WXZevkIqswv5VQNggCb1EgArHC0Mo9GurxH1YPOBybhzXeBlS7Hp85c144l%2FxfbGCzX0ypfjI0Z%2FH2c1TXFxxaSjaE%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240127T144304Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFFSH4ZXAD%2F20240127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=55f6848bc7c11f072a955e69c6c55e11149ea3f2a155c80dd4336f0e7a0a9eee",
                "recipeUri": "http://www.edamam.com/ontologies/edamam.owl#recipe_6e53ccee356ea429bd1fec75f370cb66",
                "_id": "65b5168003b33c73d195f8ff"
            },
        
        ],
        "__v": 251,
        "incorrectPasswordAttempts": 0,
        "incorrectPasswordAttemptTime": "2024-03-10T17:13:17.428Z",
        "verificationCode": "$2a$10$uq5216P36Ec8yI2kxYiL3ufOK9vb43uYpCts1FlnYzry1jmch.wcW",
        "verificationCodeTimestamp": "2024-03-10T17:13:27.027Z",
        "verified": true
    }));
    global.host = "http://localhost:8080";
});

afterEach(() => {
    jest.clearAllMocks();
});

const json = {
    "recipe": {
        "uri": "http://www.edamam.com/ontologies/edamam.owl#recipe_70db71f7ddfb38bff24ea63c125ad9f3",
        "label": "Fruit Smoothie",
        "image": "https://edamam-product-images.s3.amazonaws.com/web-img/012/0128942079cec8665550cf47c6f5eb6e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLWVhc3QtMSJIMEYCIQDFf1BLNxK9tQlp35%2FPbFc2x2meh9cqt7YTj7rmeTMc4QIhAP2bxj%2Bqt4S1J7yaHFbVU55WPgEqd5z2rFRAWgatuupVKrkFCBsQABoMMTg3MDE3MTUwOTg2Igz43gg%2Fx5ISHGl8%2FqsqlgWLi1%2FjQ3IquNHrgAVWcnw%2Fn6o%2BaeQM2w4KQs3DpJT0IZoYi49sIup%2FWI6BoRvh%2B9S5Iri%2Ft6218hJtBTHZmqqvoRB1ot0okAoAsfSPMIleIiyQEiSVkOb3%2Bt%2FFxREf3IERXRCjTgm%2BGQIKUDxlPF%2Fpa3Gv8McsT2QokPIVH3Z2ZllDKPL6H77yDgqsDEfoQq6OgqXYsbD87SZXOuE6cVutrg3HiN776yPn5qn3Ycl%2B0WSzkx%2BOon4dAJ9F5OmXHqBKJnCIgmJhMQUvH02H7lSB4a0FER7Uzo5eB9Cnwp6WneMxFgX081GgDDZWd7q3sh2QcXK0jSoskEinwhrtRNngOyfY4gv00owvE5DYWux8ykhKgc0m%2FSqJIRc11l7%2FVoaOFeV8zHfxy169K9Ozr0m3TI70MPFh5mdgki%2FJpn8VhboqjtzsEp1lBrwq8e7Shg%2FYHY7kfcboOhz0unNycSTf8EKypv%2F1mqGvY%2FbIPmlpFYeNaOjpu9YGq8Emu6EaYqdIBmIdejTCagW8LzsQmUFzDDIr8YfiedZw2lpkyue7zX65UL4ixs%2BTYeFFIVXYhj42pZRDScxW0prl3FCehMlx%2F6n7ykpAkvYO2fR72wtpdvNuYd%2BAaGq%2FvO%2FYaN5ZNSiYPhwP0hduBRp%2B7ZMhdqPqMlu9J5RFUc4lSmKIGod8%2FNAKSGQppQK9EqSS%2Fo%2FHe9nfCq9gfLJ3UyiD0xPdkbgofJ3AFyxu4aLj0Sci%2BpSUW836EPF6%2FVKlAY8Z%2FHwIr5aEkswiK7%2BVn9F3yZ6E42aBJ1UZKb61YUEdz0G1GE%2F%2BiHZG7nlK1KfEpqCMx%2Fw36kpyJHSoUiScnYdCeN5wJDFmmZMqDJN5Xa48Lor7hRz0w9iKwGb2uTDT6revBjqwAaiAWe7nolRS72EJcFBf%2Bq9V3xSeddduPKvBkZPBm6SgDftCvti%2BtOFI1uqXP2jDcQHfhR%2BindRuX%2Fhhcl13nwtvazMvIH3CMLSGIZ1nYdemX5Va1XoM5X%2Fog%2FNOED8rpx%2FIOv80MvMhHfoPMciBXHg7JWyJxEh%2FlqMolLtVNJA24Wlu4YPFLjwrjy%2BUv9buLiMriodmUUPN00AVFFT8bO3Te4oqeCPIrC6aqyhXDKnw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240310T192622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKIIC72GL%2F20240310%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=74a2625d00fa859813375327b6fce45cf19aae22fd473f5da7d885aa3eacab1f",
        "images": {
            "THUMBNAIL": {
                "url": "https://edamam-product-images.s3.amazonaws.com/web-img/012/0128942079cec8665550cf47c6f5eb6e-s.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLWVhc3QtMSJIMEYCIQDFf1BLNxK9tQlp35%2FPbFc2x2meh9cqt7YTj7rmeTMc4QIhAP2bxj%2Bqt4S1J7yaHFbVU55WPgEqd5z2rFRAWgatuupVKrkFCBsQABoMMTg3MDE3MTUwOTg2Igz43gg%2Fx5ISHGl8%2FqsqlgWLi1%2FjQ3IquNHrgAVWcnw%2Fn6o%2BaeQM2w4KQs3DpJT0IZoYi49sIup%2FWI6BoRvh%2B9S5Iri%2Ft6218hJtBTHZmqqvoRB1ot0okAoAsfSPMIleIiyQEiSVkOb3%2Bt%2FFxREf3IERXRCjTgm%2BGQIKUDxlPF%2Fpa3Gv8McsT2QokPIVH3Z2ZllDKPL6H77yDgqsDEfoQq6OgqXYsbD87SZXOuE6cVutrg3HiN776yPn5qn3Ycl%2B0WSzkx%2BOon4dAJ9F5OmXHqBKJnCIgmJhMQUvH02H7lSB4a0FER7Uzo5eB9Cnwp6WneMxFgX081GgDDZWd7q3sh2QcXK0jSoskEinwhrtRNngOyfY4gv00owvE5DYWux8ykhKgc0m%2FSqJIRc11l7%2FVoaOFeV8zHfxy169K9Ozr0m3TI70MPFh5mdgki%2FJpn8VhboqjtzsEp1lBrwq8e7Shg%2FYHY7kfcboOhz0unNycSTf8EKypv%2F1mqGvY%2FbIPmlpFYeNaOjpu9YGq8Emu6EaYqdIBmIdejTCagW8LzsQmUFzDDIr8YfiedZw2lpkyue7zX65UL4ixs%2BTYeFFIVXYhj42pZRDScxW0prl3FCehMlx%2F6n7ykpAkvYO2fR72wtpdvNuYd%2BAaGq%2FvO%2FYaN5ZNSiYPhwP0hduBRp%2B7ZMhdqPqMlu9J5RFUc4lSmKIGod8%2FNAKSGQppQK9EqSS%2Fo%2FHe9nfCq9gfLJ3UyiD0xPdkbgofJ3AFyxu4aLj0Sci%2BpSUW836EPF6%2FVKlAY8Z%2FHwIr5aEkswiK7%2BVn9F3yZ6E42aBJ1UZKb61YUEdz0G1GE%2F%2BiHZG7nlK1KfEpqCMx%2Fw36kpyJHSoUiScnYdCeN5wJDFmmZMqDJN5Xa48Lor7hRz0w9iKwGb2uTDT6revBjqwAaiAWe7nolRS72EJcFBf%2Bq9V3xSeddduPKvBkZPBm6SgDftCvti%2BtOFI1uqXP2jDcQHfhR%2BindRuX%2Fhhcl13nwtvazMvIH3CMLSGIZ1nYdemX5Va1XoM5X%2Fog%2FNOED8rpx%2FIOv80MvMhHfoPMciBXHg7JWyJxEh%2FlqMolLtVNJA24Wlu4YPFLjwrjy%2BUv9buLiMriodmUUPN00AVFFT8bO3Te4oqeCPIrC6aqyhXDKnw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240310T192622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKIIC72GL%2F20240310%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bebbf0cacbf715ee060b5f43ab51be472e414f3420c32eba902f07e3037d39f2",
                "width": 100,
                "height": 100
            },
            "SMALL": {
                "url": "https://edamam-product-images.s3.amazonaws.com/web-img/012/0128942079cec8665550cf47c6f5eb6e-m.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLWVhc3QtMSJIMEYCIQDFf1BLNxK9tQlp35%2FPbFc2x2meh9cqt7YTj7rmeTMc4QIhAP2bxj%2Bqt4S1J7yaHFbVU55WPgEqd5z2rFRAWgatuupVKrkFCBsQABoMMTg3MDE3MTUwOTg2Igz43gg%2Fx5ISHGl8%2FqsqlgWLi1%2FjQ3IquNHrgAVWcnw%2Fn6o%2BaeQM2w4KQs3DpJT0IZoYi49sIup%2FWI6BoRvh%2B9S5Iri%2Ft6218hJtBTHZmqqvoRB1ot0okAoAsfSPMIleIiyQEiSVkOb3%2Bt%2FFxREf3IERXRCjTgm%2BGQIKUDxlPF%2Fpa3Gv8McsT2QokPIVH3Z2ZllDKPL6H77yDgqsDEfoQq6OgqXYsbD87SZXOuE6cVutrg3HiN776yPn5qn3Ycl%2B0WSzkx%2BOon4dAJ9F5OmXHqBKJnCIgmJhMQUvH02H7lSB4a0FER7Uzo5eB9Cnwp6WneMxFgX081GgDDZWd7q3sh2QcXK0jSoskEinwhrtRNngOyfY4gv00owvE5DYWux8ykhKgc0m%2FSqJIRc11l7%2FVoaOFeV8zHfxy169K9Ozr0m3TI70MPFh5mdgki%2FJpn8VhboqjtzsEp1lBrwq8e7Shg%2FYHY7kfcboOhz0unNycSTf8EKypv%2F1mqGvY%2FbIPmlpFYeNaOjpu9YGq8Emu6EaYqdIBmIdejTCagW8LzsQmUFzDDIr8YfiedZw2lpkyue7zX65UL4ixs%2BTYeFFIVXYhj42pZRDScxW0prl3FCehMlx%2F6n7ykpAkvYO2fR72wtpdvNuYd%2BAaGq%2FvO%2FYaN5ZNSiYPhwP0hduBRp%2B7ZMhdqPqMlu9J5RFUc4lSmKIGod8%2FNAKSGQppQK9EqSS%2Fo%2FHe9nfCq9gfLJ3UyiD0xPdkbgofJ3AFyxu4aLj0Sci%2BpSUW836EPF6%2FVKlAY8Z%2FHwIr5aEkswiK7%2BVn9F3yZ6E42aBJ1UZKb61YUEdz0G1GE%2F%2BiHZG7nlK1KfEpqCMx%2Fw36kpyJHSoUiScnYdCeN5wJDFmmZMqDJN5Xa48Lor7hRz0w9iKwGb2uTDT6revBjqwAaiAWe7nolRS72EJcFBf%2Bq9V3xSeddduPKvBkZPBm6SgDftCvti%2BtOFI1uqXP2jDcQHfhR%2BindRuX%2Fhhcl13nwtvazMvIH3CMLSGIZ1nYdemX5Va1XoM5X%2Fog%2FNOED8rpx%2FIOv80MvMhHfoPMciBXHg7JWyJxEh%2FlqMolLtVNJA24Wlu4YPFLjwrjy%2BUv9buLiMriodmUUPN00AVFFT8bO3Te4oqeCPIrC6aqyhXDKnw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240310T192622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKIIC72GL%2F20240310%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=18810c9470c643beb73d95a2e05eb95e3643bb7cf7a5dfd8a1657ab20bf16b56",
                "width": 200,
                "height": 200
            },
            "REGULAR": {
                "url": "https://edamam-product-images.s3.amazonaws.com/web-img/012/0128942079cec8665550cf47c6f5eb6e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLWVhc3QtMSJIMEYCIQDFf1BLNxK9tQlp35%2FPbFc2x2meh9cqt7YTj7rmeTMc4QIhAP2bxj%2Bqt4S1J7yaHFbVU55WPgEqd5z2rFRAWgatuupVKrkFCBsQABoMMTg3MDE3MTUwOTg2Igz43gg%2Fx5ISHGl8%2FqsqlgWLi1%2FjQ3IquNHrgAVWcnw%2Fn6o%2BaeQM2w4KQs3DpJT0IZoYi49sIup%2FWI6BoRvh%2B9S5Iri%2Ft6218hJtBTHZmqqvoRB1ot0okAoAsfSPMIleIiyQEiSVkOb3%2Bt%2FFxREf3IERXRCjTgm%2BGQIKUDxlPF%2Fpa3Gv8McsT2QokPIVH3Z2ZllDKPL6H77yDgqsDEfoQq6OgqXYsbD87SZXOuE6cVutrg3HiN776yPn5qn3Ycl%2B0WSzkx%2BOon4dAJ9F5OmXHqBKJnCIgmJhMQUvH02H7lSB4a0FER7Uzo5eB9Cnwp6WneMxFgX081GgDDZWd7q3sh2QcXK0jSoskEinwhrtRNngOyfY4gv00owvE5DYWux8ykhKgc0m%2FSqJIRc11l7%2FVoaOFeV8zHfxy169K9Ozr0m3TI70MPFh5mdgki%2FJpn8VhboqjtzsEp1lBrwq8e7Shg%2FYHY7kfcboOhz0unNycSTf8EKypv%2F1mqGvY%2FbIPmlpFYeNaOjpu9YGq8Emu6EaYqdIBmIdejTCagW8LzsQmUFzDDIr8YfiedZw2lpkyue7zX65UL4ixs%2BTYeFFIVXYhj42pZRDScxW0prl3FCehMlx%2F6n7ykpAkvYO2fR72wtpdvNuYd%2BAaGq%2FvO%2FYaN5ZNSiYPhwP0hduBRp%2B7ZMhdqPqMlu9J5RFUc4lSmKIGod8%2FNAKSGQppQK9EqSS%2Fo%2FHe9nfCq9gfLJ3UyiD0xPdkbgofJ3AFyxu4aLj0Sci%2BpSUW836EPF6%2FVKlAY8Z%2FHwIr5aEkswiK7%2BVn9F3yZ6E42aBJ1UZKb61YUEdz0G1GE%2F%2BiHZG7nlK1KfEpqCMx%2Fw36kpyJHSoUiScnYdCeN5wJDFmmZMqDJN5Xa48Lor7hRz0w9iKwGb2uTDT6revBjqwAaiAWe7nolRS72EJcFBf%2Bq9V3xSeddduPKvBkZPBm6SgDftCvti%2BtOFI1uqXP2jDcQHfhR%2BindRuX%2Fhhcl13nwtvazMvIH3CMLSGIZ1nYdemX5Va1XoM5X%2Fog%2FNOED8rpx%2FIOv80MvMhHfoPMciBXHg7JWyJxEh%2FlqMolLtVNJA24Wlu4YPFLjwrjy%2BUv9buLiMriodmUUPN00AVFFT8bO3Te4oqeCPIrC6aqyhXDKnw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240310T192622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKIIC72GL%2F20240310%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=74a2625d00fa859813375327b6fce45cf19aae22fd473f5da7d885aa3eacab1f",
                "width": 300,
                "height": 300
            },
            "LARGE": {
                "url": "https://edamam-product-images.s3.amazonaws.com/web-img/012/0128942079cec8665550cf47c6f5eb6e-l.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBIaCXVzLWVhc3QtMSJIMEYCIQDFf1BLNxK9tQlp35%2FPbFc2x2meh9cqt7YTj7rmeTMc4QIhAP2bxj%2Bqt4S1J7yaHFbVU55WPgEqd5z2rFRAWgatuupVKrkFCBsQABoMMTg3MDE3MTUwOTg2Igz43gg%2Fx5ISHGl8%2FqsqlgWLi1%2FjQ3IquNHrgAVWcnw%2Fn6o%2BaeQM2w4KQs3DpJT0IZoYi49sIup%2FWI6BoRvh%2B9S5Iri%2Ft6218hJtBTHZmqqvoRB1ot0okAoAsfSPMIleIiyQEiSVkOb3%2Bt%2FFxREf3IERXRCjTgm%2BGQIKUDxlPF%2Fpa3Gv8McsT2QokPIVH3Z2ZllDKPL6H77yDgqsDEfoQq6OgqXYsbD87SZXOuE6cVutrg3HiN776yPn5qn3Ycl%2B0WSzkx%2BOon4dAJ9F5OmXHqBKJnCIgmJhMQUvH02H7lSB4a0FER7Uzo5eB9Cnwp6WneMxFgX081GgDDZWd7q3sh2QcXK0jSoskEinwhrtRNngOyfY4gv00owvE5DYWux8ykhKgc0m%2FSqJIRc11l7%2FVoaOFeV8zHfxy169K9Ozr0m3TI70MPFh5mdgki%2FJpn8VhboqjtzsEp1lBrwq8e7Shg%2FYHY7kfcboOhz0unNycSTf8EKypv%2F1mqGvY%2FbIPmlpFYeNaOjpu9YGq8Emu6EaYqdIBmIdejTCagW8LzsQmUFzDDIr8YfiedZw2lpkyue7zX65UL4ixs%2BTYeFFIVXYhj42pZRDScxW0prl3FCehMlx%2F6n7ykpAkvYO2fR72wtpdvNuYd%2BAaGq%2FvO%2FYaN5ZNSiYPhwP0hduBRp%2B7ZMhdqPqMlu9J5RFUc4lSmKIGod8%2FNAKSGQppQK9EqSS%2Fo%2FHe9nfCq9gfLJ3UyiD0xPdkbgofJ3AFyxu4aLj0Sci%2BpSUW836EPF6%2FVKlAY8Z%2FHwIr5aEkswiK7%2BVn9F3yZ6E42aBJ1UZKb61YUEdz0G1GE%2F%2BiHZG7nlK1KfEpqCMx%2Fw36kpyJHSoUiScnYdCeN5wJDFmmZMqDJN5Xa48Lor7hRz0w9iKwGb2uTDT6revBjqwAaiAWe7nolRS72EJcFBf%2Bq9V3xSeddduPKvBkZPBm6SgDftCvti%2BtOFI1uqXP2jDcQHfhR%2BindRuX%2Fhhcl13nwtvazMvIH3CMLSGIZ1nYdemX5Va1XoM5X%2Fog%2FNOED8rpx%2FIOv80MvMhHfoPMciBXHg7JWyJxEh%2FlqMolLtVNJA24Wlu4YPFLjwrjy%2BUv9buLiMriodmUUPN00AVFFT8bO3Te4oqeCPIrC6aqyhXDKnw&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240310T192622Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFKIIC72GL%2F20240310%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=304c21466280c7d0ae68069f6d2d0a0f006d28d3e1797ffdb227afa4865c1065",
                "width": 600,
                "height": 600
            }
        },
        "source": "Martha Stewart",
        "url": "http://www.marthastewart.com/332804/fruit-smoothie",
        "shareAs": "http://www.edamam.com/recipe/fruit-smoothie-70db71f7ddfb38bff24ea63c125ad9f3/smoothie/dairy-free",
        "yield": 2,
        "dietLabels": [
            "High-Fiber",
            "Low-Fat",
            "Low-Sodium"
        ],
        "healthLabels": [
            "Vegan",
            "Vegetarian",
            "Pescatarian",
            "Mediterranean",
            "DASH",
            "Shellfish-Free",
            "Pork-Free",
            "Red-Meat-Free",
            "Crustacean-Free",
            "Celery-Free",
            "Mustard-Free",
            "Sesame-Free",
            "Lupine-Free",
            "Mollusk-Free",
            "Alcohol-Free",
            "No oil added",
            "Sulfite-Free",
            "FODMAP-Free",
            "Kosher"
        ],
        "cautions": [
            "Sulfites"
        ],
        "ingredientLines": [
            "2 navel oranges, peel and pith removed, cut into chunks",
            "1 cup frozen raspberries",
            "1 cup frozen blueberries"
        ],
        "ingredients": [
            {
                "text": "2 navel oranges, peel and pith removed, cut into chunks",
                "quantity": 2,
                "measure": "<unit>",
                "food": "navel oranges",
                "weight": 280,
                "foodCategory": "fruit",
                "foodId": "food_agbq12basb38ixb00moxbahrx6f9",
                "image": "https://www.edamam.com/food-img/ffc/ffcb7b039bfc783fcfb417489160366e.jpg"
            },
            {
                "text": "1 cup frozen raspberries",
                "quantity": 1,
                "measure": "cup",
                "food": "frozen raspberries",
                "weight": 140,
                "foodCategory": "fruit",
                "foodId": "food_bfgxm5ubf6b63vbnwpgq9apywgi9",
                "image": "https://www.edamam.com/food-img/85c/85c5d86212804892206f2cf3d996ba40.jpg"
            },
            {
                "text": "1 cup frozen blueberries",
                "quantity": 1,
                "measure": "cup",
                "food": "blueberries",
                "weight": 148,
                "foodCategory": "fruit",
                "foodId": "food_bgkl0cuasoeomtbolalmcauhha54",
                "image": "https://www.edamam.com/food-img/f55/f55705a2a9ea9f7abf449a05fa968139.png"
            }
        ],
        "calories": 299.96000000000004,
        "totalCO2Emissions": 549.84,
        "co2EmissionsClass": "C",
        "totalWeight": 568,
        "totalTime": 0,
        "cuisineType": [
            "american"
        ],
        "mealType": [
            "breakfast"
        ],
        "dishType": [
            "drinks"
        ],

    },
    "_links": {
        "self": {
            "title": "Self",
            "href": "https://api.edamam.com/api/recipes/v2/70db71f7ddfb38bff24ea63c125ad9f3?type=public&app_id=3cd9f1b4&app_key=e19d74b936fc6866b5ae9e2bd77587d9"
        }
    }
}
const ingredients = [
    "1 cup chopped fresh pineapple",
    "½ cup chopped peeled papaya",
    "¼ cup guava nectar, (see Ingredient Note)",
    "1 tablespoon lime juice",
    "1 teaspoon grenadine, (see Ingredient Note)",
    "½ cup ice"
];
const directions = [
    [
        "Combine yogurt, acai, blueberries, banana and coconut water in a blender. Puree until smooth. Pour smoothie into a bowl and top with raspberries, granola, coconut and chia seeds."
    ]
];

const source = 'Martha Stewart';

describe('Get Health string', () => {
    test('check getting health string when input is empty', () => {
        expect(edamam.getHealthString([])).toBe("");
    });
    test('check health string when inpt is high protein', () => {
        expect(edamam.getHealthString(['High Protein'])).toBe("&health=High Protein");
    });
    test('check getting health string when input multiple items', () => {
        expect(edamam.getHealthString(['High Protein', "High Fiber"])).toBe("&health=High Protein&health=High Fiber");
    });
});

describe('Get Diet string', () => {
    test('check getting diet string when input is empty', () => {
        expect(edamam.getDietString([])).toBe("");
    });
    test('check getting diet string when input is Kosher', () => {
        expect(edamam.getDietString(["Kosher"])).toBe("&diet=Kosher");
    });
});

describe('Test if source is viable', () => {
    test('check that Food52 is viable', () => {
        expect(edamam.sourceIsViable('Food52')).toBe(true);
    });
    test('check that Martha Stewart is viable', () => {
        expect(edamam.sourceIsViable('Martha Stewart')).toBe(true);
    });
    test('check that Food Network is viable', () => {
        expect(edamam.sourceIsViable('Food Network')).toBe(true);
    });
    test('check that Simply Recipes is viable', () => {
        expect(edamam.sourceIsViable('Simply Recipes')).toBe(true);
    });
    test('check that Delish is viable', () => {
        expect(edamam.sourceIsViable('Delish')).toBe(true);
    });
    test('check that EatingWell is viable', () => {
        expect(edamam.sourceIsViable('EatingWell')).toBe(true);
    });
    test('check that FoodList is  not viable', () => {
        expect(edamam.sourceIsViable('FoodList')).toBe(false);
    });
    test('check that no input is not viable', () => {
        expect(edamam.sourceIsViable('')).toBe(false);
    });
    
});


describe('Get Heart icon', () => {
    document.body.innerHTML = ``;
    test('Get the heart icon', () => {
        const heartIcon = document.createElement('img');
        const returnedHeartIcon = edamam.getHeartIcon(heartIcon);
        expect(returnedHeartIcon).not.toBeNull();
        const heartButton = document.getElementsByClassName('heart-button');
        expect(heartButton).not.toBeNull();
    });
});



describe('Get setupRecipe', () => {
    test('Set up recipie with default json', () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.currentUser.getUserNameFromCookie = jest.fn().mockReturnValue('test');

        document.body.innerHTML = `
        <div class="recipe-list" id="recipe-list"> 
        <br><br><br>
        <ul id="recipeList"></ul>
        <br><br><br>
        </div>
        <div id="selected-recipe-details">
        <br>
        <div id="recipe-image"></div>
        <h2 id="recipe-name"  style="font-size: 10vw;"></h2>
        <div id="heart-container" class ="tooltip">
        </div>
        <div class="ingredient-details">
          <h4 id="ingredients"></h4>
          <ul id="ingredient-list"></ul>
        </div>
        <div class="recipe-details">
          <h4 id="directions"></h4>
        <ul id="directions-list"></ul>
        </div>
      </div>
        `;
        
        expect(edamam.setupRecipe(json)).not.toBeNull();
    });
});

describe('Test DeleteInFavorites', () => {
    test('DeleteinFavorites with default json', () => {
        const results = "";
        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve(JSON.stringify({type: 'basic', url: 'http://localhost:8080/api/v1/users/65b5009e3ff7a8a24a418ed4/favorites', redirected: false, status: 200, ok: true})),
         )
        const response = edamam.deleteInFavorites(json, ingredients, results);
        expect(response).toEqual(Promise.resolve({}));
        expect(fetch).toHaveBeenCalledTimes(0);
    });
});

describe('Test SearchRecipe', () => {
    test('Search recipie with default json', () => {
        document.body.innerHTML = `
        <div class="search-recipe">
        <form onsubmit="return edamam.searchRecipe(event)">
          <input type="text" id="search-input" placeholder="Enter recipe to search">
          <button id="recipe-search-button" type="submit">Search</button>
    
        <div class="recipe-list" id="recipe-list"> 
        <br><br><br>
        <ul id="recipeList"></ul>
        <br><br><br>
        </div>
    
        <div class="no-recipe-found" id="no-recipe-found" hidden>
          <p>No recipe found for the search key entered. Please try again.</p>
        </div>
    
        </form>  
      </div>
    
      <div id="selected-recipe-details">
        <br>
        <div id="recipe-image"></div>
        <h2 id="recipe-name"></h2>
        <div id="heart-container" class ="tooltip">
        </div>
        <div class="ingredient-details">
          <h4 id="ingredients"></h4>
          <ul id="ingredient-list"></ul>
        </div>
        <div class="recipe-details">
          <h4 id="directions"></h4>
        <ul id="directions-list"></ul>
        </div>
      </div>`;
        const event = {
            preventDefault: jest.fn()
        };
        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve(JSON.stringify({type: 'basic', url: 'http://localhost:8080/api/v1/users/65b5009e3ff7a8a24a418ed4/favorites', redirected: false, status: 200, ok: true})),
    )
        expect(edamam.searchRecipe(event)).not.toBeNull();
    });
});

describe('Test ShowRecipe', () => {
    test('test showing a default recipe', () => {
        const event = {
            preventDefault: jest.fn()
        };
        global.currentUser.getUserNameFromCookie = jest.fn().mockReturnValue('test');
        document.body.innerHTML = `
        <div class="recipe-details">
        <h4 id="directions"></h4>
        <ul id="directions-list"></ul>
        </div>
        <div class="recipe-list" id="recipe-list"> 
        <br><br><br>
        <ul id="recipeList"></ul>
        <br><br><br>
        </div>
        <div id="selected-recipe-details">
        <div id="selected-recipe-details">
        <br>
        <div id="recipe-image"></div>
        <h2 id="recipe-name"  style="font-size: 10vw;"></h2>
        <div id="heart-container" class ="tooltip">
        </div>
        <div class="ingredient-details">
          <h4 id="ingredients"></h4>
          <ul id="ingredient-list"></ul>
        </div>
        <div class="recipe-details">
          <h4 id="directions"></h4>
        <ul id="directions-list"></ul>
        </div>
      </div>
        `;
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue([
                [
                    [
                        "In a blender, combine oats, yogurt, banana, fat-free milk, honey, and cinnamon."
                    ],
                    [
                        "Puree until smooth."
                    ],
                    [
                        "If smoothie is too thick, add a small amount more milk and blend again."
                    ],
                    [
                        "Is it OK to put raw oats in a smoothie?"
                    ],
                    [
                        "Yes, raw oats are safe and nutritious to eat whether you add them to a bowl of yogurt and fruit, blend them in your smoothie, or make overnight oats."
                    ],
                    [
                        "Should you soak oats before using in a smoothie?"
                    ],
                    [
                        "We don’t call for soaking the oats before using them in our banana-oat smoothie but you can. Soaking the oats will give your smoothie a smoother texture. To soak the oats, use the milk from the smoothie recipe (and blend the milk and oats when you make the smoothie), or use water if you prefer—It will produce a thinner consistency. Soak the oats for at least 30 minutes."
                    ]
                ]
            ]),
        });
        edamam.isFavorited = jest.fn().mockReturnValueOnce(true);
        const response = edamam.showRecipe(json, source);
        expect(response).toBe(false);
    });
});

describe('Test PutToFavorites', () => {
  
    test('Put into favorites with default json', () => {
        const User = "test";
        const results = "";
        join = jest.fn();
        join.mockImplementationOnce("recipie, things, here")

        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve(JSON.stringify({type: 'basic', url: 'http://localhost:8080/api/v1/users/65b5009e3ff7a8a24a418ed4/favorites', redirected: false, status: 200, ok: true})),
    )
        const response = edamam.putToFavorites(json, ingredients, results);
        expect(response).toEqual(Promise.resolve({}));
        expect(fetch).toHaveBeenCalledTimes(0);
    });
});



describe('Test IsFavorited', () => {
    const favoritesResponse = { acknowledge: true, matchedCount: 1, modifiedCount: 1, upsertedCount: 0, upsertedId: null};

    test('Test is favorited with default json', () => {
        global.currentUser.getUserNameFromCookie = jest.fn().mockReturnValue('test');
        global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
            status: 200,
            json: () => Promise.resolve(JSON.stringify(favoritesResponse)),
        })
         )
        const response = edamam.isFavorited(json);
        expect(response).toBe(true);
        expect(fetch).toHaveBeenCalledTimes(0);
    });
});

describe('getUserNameFromCookie() function', () => {
    it('mocked user name from cookie - successful', () => {
        global.document.cookie = "userName=test";
        const result = edamam.getUserNameFromCookie();
        expect(result).toBe('test');
    });
});