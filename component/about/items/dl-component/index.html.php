<article class="dl-component component <?php print $classes; ?>" style="<?php print $style; ?>">
	<dl class="dl-component-content">
		<dt><?php print $data['subject']; ?></dt>
		<dd>
			<ul>
<?php		for($i=0; $i<@count($data['data']); $i++) {?>
				<li><?php print $data['data'][$i]['subject']; ?> (<?php print $data['data'][$i]['description']; ?>)</li>
<?php		}?>
			</ul>
		</dd>
	</dl>
</article>
