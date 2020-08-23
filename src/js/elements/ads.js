import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui';

import {
    PromoBanner
} from '@vkontakte/vkui';

// const promoBannerProps = {
//     title: 'Заголовок',
//     domain: 'vk.com',
//     trackingLink: 'https://vk.com',
//     ctaText: 'Перейти',
//     advertisingLabel: 'Реклама',
//     iconLink: 'https://sun9-7.userapi.com/c846420/v846420985/1526c3/ISX7VF8NjZk.jpg',
//     description: 'Описание рекламы',
//     ageRestrictions: 14,
//     statistics: [
//         { url: '', type: 'playbackStarted' },
//         { url: '', type: 'click' }
//     ]
// };

export const Ads = () => {
    const [promoBannerProps, setpromoBannerProps] = useState(null);
    async function loadAds() {
        const banner = bridge.send('VKWebAppGetAds')
            .then((promoBannerProps) => {
                return promoBannerProps
            });
        setpromoBannerProps(banner)
    }
    loadAds();
    return (
        promoBannerProps !== null ?
        <PromoBanner bannerData={promoBannerProps} /> :
            null
    )
};
