

<?php the_content(); //for use with Elementor page builder ?>

<section id="content">
    <div class="container">
        <div class="row">

            <?php get_template_part('template-parts/content', 'sidebar'); ?>

            <div class="span8">
                <?php if (have_posts()) : ?>

                    <!-- Start of the main loop. -->
                    <?php while (have_posts()) : the_post(); ?>

                        <article class="single">
                            <div class="row">

                                <div class="span8">
                                    <div class="post-image">
                                        <div class="post-heading">
                                            <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                                        </div>
                                        <?php if (has_post_thumbnail()) : ?>
                                            <a href="<?php the_permalink(); ?>" alt="<?php the_title_attribute(); ?>">
                                                <?php the_post_thumbnail(); ?>
                                            </a>
                                        <?php endif; ?>
                                    </div>
                                    <div class="meta-post">
                                        <ul>
                                            <li><i class="icon-file"></i></li>
                                            <li>By <a href="#" class="author"><?php the_author(); ?></a></li>
                                            <li>On <a href="#" class="date"><?php the_date(); ?></a></li>
                                            <li>Tags: <a href="#">Design</a>, <a href="#"><?php the_tags(); ?></a></li>
                                        </ul>
                                    </div>
                                    <p>
                                        <?php the_content(); ?>
                                    </p>

                                </div>
                            </div>
                        </article>

                        <!-- author info -->
                        <div class="about-author">
                            <a href="<?php echo get_the_author_meta('user_url'); ?>" class="thumbnail align-left">
                                
                                <?php if (get_avatar(get_the_author_meta('ID')) !== FALSE): ?>
                                <?php echo get_avatar(get_the_author_meta('ID')); ?>
                                <?php else: ?>
                                    <img src= "<?php echo get_template_directory_uri()?>/assests/img/avatar.png">
                                <?php endif; ?>
                            </a>
                            <h5><strong><a href="#"><?php echo get_the_author_meta('first_name') .' '.get_the_author_meta('last_name')?></a></strong></h5>
                            <p>
                                <?php echo get_the_author_meta('description'); ?>
                            </p>
                        </div>

                        <div class="comment-area">

                            <h4><?php echo get_comments( array('count'=> true) ); ?> Comments</h4>
                            <div class="media">
                                <a href="#" class="pull-left"><img src="img/avatar.png" alt="" class="img-circle" /></a>
                                <div class="media-body">
                                    <div class="media-content">
                                        <h6><span>March 12, 2013</span> Michael Simpson</h6>
                                        <p>
                                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                        </p>

                                        <a href="#" class="align-right">Reply</a>
                                    </div>
                                </div>
                            </div>
                            <div class="media">
                                <a href="#" class="pull-left"><img src="img/avatar.png" alt="" class="img-circle" /></a>
                                <div class="media-body">
                                    <div class="media-content">
                                        <h6><span>March 12, 2013</span> Smith karlsen</h6>
                                        <p>
                                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                        </p>

                                        <a href="#" class="align-right">Reply</a>
                                    </div>
                                    <div class="media">
                                        <a href="#" class="pull-left"><img src="img/avatar.png" alt="" class="img-circle" /></a>
                                        <div class="media-body">
                                            <div class="media-content">
                                                <h6><span>June 22, 2013</span> Jay Moeller</h6>
                                                <p>
                                                    Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                                </p>

                                                <a href="#" class="align-right">Reply</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="media">
                                <a href="#" class="pull-left"><img src="img/avatar.png" alt="" class="img-circle" /></a>
                                <div class="media-body">
                                    <div class="media-content">
                                        <h6><span>June 24, 2013</span> Dean Zaloza</h6>
                                        <p>
                                            Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
                                        </p>

                                        <a href="#" class="align-right">Reply</a>
                                    </div>
                                </div>
                            </div>

                            <div class="marginbot30"></div>
                            <h4>Leave your comment</h4>

                            <form id="commentform" action="#" method="post" name="comment-form">
                                <div class="row">
                                    <div class="span4">
                                        <input type="text" placeholder="* Enter your full name" />
                                    </div>
                                    <div class="span4">
                                        <input type="text" placeholder="* Enter your email address" />
                                    </div>
                                    <div class="span8 margintop10">
                                        <input type="text" placeholder="Enter your website" />
                                    </div>
                                    <div class="span8 margintop10">
                                        <p>
                                            <textarea rows="12" class="input-block-level" placeholder="*Your comment here"></textarea>
                                        </p>
                                        <p>
                                            <button class="btn btn-theme btn-medium margintop10" type="submit">Submit comment</button>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                <?php endwhile; ?>

            <?php endif; ?>
        </div>
    </div>
</section>

