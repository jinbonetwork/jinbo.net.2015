		<style>
			#front-header .door-wrap .up-door {
				clip-path: url("#top-door-clip");
			}
		</style>
		<div id="front-header" class="section container-fluid" >
			<div class="door-wrap">
				<div class="door up-door">
					<div class="animateheader-container">
						<div class="animateheader-wrap">
							<div id="large-header" class="animate-header">
								<canvas id="header-canvas"></canvas>
								<video class="animate-header-background-video">
									<!--source src="<?php print url("resources/images/jinbonet_logo.webm"); ?>" type="video/webm"-->
									<source src="<?php print url("resources/images/20150423-40thick-ver-03.mp4"); ?>" type="video/mp4">
								</video>
								<div class="loading"><span>로딩중</span></div>
								<!--img class="animate-header-background-image" src="<?php print url("resources/images/title-background.jpg"); ?>"-->
								<img class="animate-header-background-image" src="<?php print url("resources/images/20150423-40thick-ver-03.png"); ?>">
							</div>
						</div>
					</div>
				</div>
				<div class="door down-door">
					<div class="down-door-wrap">
						<div class="before">
						</div>
						<div class="greencover">
							<div class="inner">
								<div class="top"></div>
								<div class="right"></div>
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
					</div>
				</div>
				<div class="door-background">
				</div>
				<div class="open-door">
					<div class="inner">
						<div class="back"></div>
						<button>스크롤 내리기</button>
					</div>
				</div>
			</div>
		</div>
		<div id="front-section-container">
<?php		print $content; ?>
		</div>
		<svg width="0" height="0" style="position: absolute;z-index:0;">
			<clipPath id="top-door-clip">
				<polygon points="0,0 0,500 1280,500 1280,0">
				</polygon>
			</clipPath>
		</svg>
