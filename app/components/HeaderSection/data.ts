import serverSideImg from '../../assets/images/good-for/server-side.svg'
import mobileImg from '../../assets/images/good-for/mobile.svg'
import androidImg from '../../assets/images/good-for/android.svg'
import webImg from '../../assets/images/good-for/web.svg'

type CardsDataType = {
  id: number
  title: string
  subTitle: string
  link: string
  img: string
}

export const cardsData: CardsDataType[] = [
  {
    id: 1,
    title: 'Multiplatform Mobile',
    subTitle: 'Share the logic of your Android and iOS apps while keeping UX native',
    link: '#',
    img: mobileImg
  },
  {
    id: 2,
    title: 'Server-side',
    subTitle: 'Modern development experience with familiar JVM technology',
    link: '#',
    img: serverSideImg
  },
  {
    id: 3,
    title: 'Web Frontend',
    subTitle: 'Extend your projects to web',
    link: '#',
    img: webImg
  },
  {
    id: 4,
    title: 'Android',
    subTitle: 'Recommended by Google for building Android apps',
    link: '#',
    img: androidImg
  },
]
