import React, {useState, useEffect} from 'react'
import Icon24FavoriteOutline from '@vkontakte/icons/dist/24/favorite_outline'
import Icon24Favorite from '@vkontakte/icons/dist/24/favorite'
import {Div} from "@vkontakte/vkui"

function RatingStars(props){
    const [stars, setStars] = useState([])
    const activeStar = <Icon24Favorite width={22} height={22} fill={'ffbb00'} />
    const inactiveStar = <Icon24FavoriteOutline width={22} height={22} fill={'ffbb00'} />
    useEffect(()=>{
        let starsArr = []
        for(let i=1; i<=5; i++){
            if (i <= props.countStars){
                starsArr.push(activeStar)
            } else {
                starsArr.push(inactiveStar)
            }
        }
        setStars(starsArr)
    }, [])
    return (
        <Div style={{display: 'inline-flex', padding: 0}}>
            {
                stars.map(star=> {
                    return star
                })
            }
        </Div>
    )
}

export default RatingStars