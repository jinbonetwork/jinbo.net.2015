		<style>
			html,body {
				width: 100%;
				height: 100%;
				background: #ccc;
			}
			#clippath {
				padding: 30px;
				background: #333;
				color: #fff;
				-webkit-clip-path: polygon(0px 395px,961px 421px,960px 0px,0px 26px);
				clip-path: url("#clipPolygon");
			}
		</style>
		<div id="front-section-container">
			<div id="clippath" class="container-fluid section max-title-container movement-projects">
				<div class="max-container" style="max-width:1280px;">
					<h1>test..</h1>
					test
					<h1>test2..</h1>
				</div>
			</div>
		</div>
		<svg width="0" height="0">
			<clipPath id="clipPolygon">
				<polygon points="0 395,961 420,961 0,0 26">
				</polygon>
			</clipPath>
		</svg>
		<div>테스트</div>
