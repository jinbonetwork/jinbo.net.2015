		<div id="front-header" class="section container-fluid" >
			<div class="front-header-wrapper">
				<div class="animateheader-container">
					<div class="animateheader-wrap">
						<video class="animate-header-background-video">
							<source src="<?php print url("resources/images/yellow-green-zoomout.webm"); ?>" type="video/webm" width="100%" height="100%">
							<source src="<?php print url("resources/images/yellow-green-zoomout.mp4"); ?>" type="video/mp4" width="100%" height="100%">
						</video>
						<div class="loading"><span>로딩중</span></div>
					</div>
				</div>
				<div class="cover-container">
					<div class="door-wrap">
						<div class="door up-door">
							<div class="door-wrapper">
<?php						$browser = new Browser();
							if( $browser->getBrowser() == Browser::BROWSER_IE && $browser->getVersion() <= 9 ) {?>
								<img id="jinbonet-logo-image" src="<?php print url("resources/images/logo.png"); ?>" alt="진보네트워크센터" data-origin-width="341" data-origin-height="242" />
<?php						} else {?>
								<img id="jinbonet-logo-image" src="<?php print url("resources/images/logo.svg"); ?>" alt="진보네트워크센터" data-origin-width="341" data-origin-height="242" />
<?php						}?>
								<div id="jinbonet-scroll-door">
									<div class="inner">
										<label></label>
										<button>스크롤 내리기</button>
									</div>
								</div>
								<h1 id="jinbonet-main-logo">
									<div id="jinbonet-slogan">
										<div class="slogan"></div>
									</div>
									<div id="jinbonet-title">
										<div class="letter letter1"><span class="black"></span></div>
										<div class="letter letter2"><span class="black"></span></div>
										<div class="letter letter3"><span class="black"></span></div>
										<div class="letter letter4"><span class="black"></span></div>
										<div class="letter letter5"><span class="black"></span></div>
										<div class="letter letter6"><span class="black"></span></div>
										<div class="letter letter7"><span class="black"></span></div>
										<div class="letter letter8"><span class="black"></span></div>
									</div>
								</h1>
								<div class="diagonal-background"><div class="diagonal"></div></div>
							</div>
						</div>
						<div class="door down-door">
							<div class="door-wrapper">
								<h1 id="jinbonet-main-logo">
								<!--img src="<?php print url("resources/images/jinbonet-headline.png"); ?>" alt="진보네트워크센터" /-->
									<div id="jinbonet-slogan">
										<div class="slogan"></div>
									</div>
									<div id="jinbonet-title">
										<div class="letter letter1"><span class="black"></span></div>
										<div class="letter letter2"><span class="black"></span></div>
										<div class="letter letter3"><span class="black"></span></div>
										<div class="letter letter4"><span class="black"></span></div>
										<div class="letter letter5"><span class="black"></span></div>
										<div class="letter letter6"><span class="black"></span></div>
										<div class="letter letter7"><span class="black"></span></div>
										<div class="letter letter8"><span class="black"></span></div>
									</div>
								</h1>
								<div class="diagonal-background"><div class="diagonal"></div></div>
							</div>
						</div>
						<div class="door-background"></div>
					</div>
				</div>
			</div>
		</div>
		<div id="front-section-container">
<?php		print $content; ?>
		</div>
