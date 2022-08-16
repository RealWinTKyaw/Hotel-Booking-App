import React from 'react'

export default function BannerBG({children,bannerBG}) {
  return (
    <header className={bannerBG}>
      {children}
    </header>
  )
}

BannerBG.defaultProps ={
  bannerBG:'defaultBannerBG'
} // render this background css if bannerBG is not specified in Banner BG tag