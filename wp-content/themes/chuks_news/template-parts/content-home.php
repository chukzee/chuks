
            <?php get_template_part('template-parts/carousel') ?>

            <?php the_content(); //for use with Elementor page builder ?>

            <section id="content">
                <div class="container">
                    <?php
                    $count = 0;
                    $num = 0;
                    $COLUMNS_COUNT = 3;
                    $MAX_ROWS = 5;
                    $closed_row = true;
                    $flyClass = '';
                    $MAX_POSTS = $COLUMNS_COUNT * $MAX_ROWS;
                    ?>


                    <?php if (have_posts()) : ?>
                        <?php
                        while (have_posts()) : the_post();
                            $num ++;
                            ?>
                            <?php
                            if ($count % $COLUMNS_COUNT == 0):
                                echo'<div class="row"> '; //---BEGIN ROW
                                $closed_row = false;
                                $num = 1;
                            endif;
                            
                            if ($num == 1):
                               $flyClass = 'flyLeft';
                            elseif ($num == $COLUMNS_COUNT):
                               $flyClass = 'flyRight'; 
                            else:
                               $flyClass = 'flyCenter';       
                            endif;
                            
                            ?>

                            <div class="span4">
                                <div class="service-box aligncenter <?php echo $flyClass ?>">
                                    <h5><?php the_title(); ?></h5>
                                    <div class="icon">
                                      <!--<img src="<?php echo get_template_directory_uri() ?>/assets/img/test/test1.jpg" alt="" />-->
                                        <?php if (has_post_thumbnail()) : ?>
                                            <a href="<?php the_permalink(); ?>" alt="<?php the_title_attribute(); ?>">
                                                <?php the_post_thumbnail(); ?>
                                            </a>
                                        <?php endif; ?>
                                    </div>

                                    <p>
                                        <?php the_excerpt(); ?>
                                    </p>
                                    <a href="<?php the_permalink(); ?>">More>></a>
                                </div>
                            </div>

                            <?php
                            if ($num == $COLUMNS_COUNT):
                                echo'</div>'; //---END ROW   
                                $closed_row = true;
                            endif;
                            
                            $count ++;
                            
                            if ($count == $MAX_POSTS):
                                break;
                            endif;
                            ?>
                        <?php endwhile; ?>
                    <?php endif; ?>

                    <?php
                    // in case of less than the multiple of like 5 posts instead of 6 or say 11 post instead of 12
                    if ($closed_row == false):
                        echo'</div>'; //---END ROW   
                    endif;
                    ?>

                    <div class="row">
                        <div class="span12 aligncenter">
                            <h3 class="title">What people <strong>saying</strong> about us</h3>
                            <div class="blankline30"></div>

                            <ul class="bxslider">
                                <li>
                                    <blockquote>
                                        Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis feugiat.Suspendisse eu erat quam. Vivamus porttitor eros quis nisi lacinia sed interdum lorem vulputate. Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis
                                        feugiat
                                    </blockquote>
                                    <div class="testimonial-autor">
                                        <img src="<?php echo get_template_directory_uri() ?>/assets/img/dummies/testimonial/1.png" alt="" />
                                        <h4>Hillary Doe</h4>
                                        <a href="#">www.companyname.com</a>
                                    </div>
                                </li>
                                <li>
                                    <blockquote>
                                        Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis feugiat.Suspendisse eu erat quam. Vivamus porttitor eros quis nisi lacinia sed interdum lorem vulputate. Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis
                                        feugiat
                                    </blockquote>
                                    <div class="testimonial-autor">
                                        <img src="<?php echo get_template_directory_uri() ?>/assets/img/dummies/testimonial/2.png" alt="" />
                                        <h4>Michael Doe</h4>
                                        <a href="#">www.companyname.com</a>
                                    </div>
                                </li>
                                <li>
                                    <blockquote>
                                        Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis feugiat.Suspendisse eu erat quam. Vivamus porttitor eros quis nisi lacinia sed interdum lorem vulputate. Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis
                                        feugiat
                                    </blockquote>
                                    <div class="testimonial-autor">
                                        <img src="<?php echo get_template_directory_uri() ?>/assets/img/dummies/testimonial/3.png" alt="" />
                                        <h4>Mark Donovan</h4>
                                        <a href="#">www.companyname.com</a>
                                    </div>
                                </li>
                                <li>
                                    <blockquote>
                                        Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis feugiat.Suspendisse eu erat quam. Vivamus porttitor eros quis nisi lacinia sed interdum lorem vulputate. Aliquam a orci quis nisi sagittis sagittis. Etiam adipiscing, justo quis
                                        feugiat
                                    </blockquote>
                                    <div class="testimonial-autor">
                                        <img src="<?php echo get_template_directory_uri() ?>/assets/img/dummies/testimonial/4.png" alt="" />
                                        <h4>Marry Doe Elliot</h4>
                                        <a href="#">www.companyname.com</a>
                                    </div>
                                </li>
                            </ul>

                        </div>
                    </div>

                </div>
            </section>

           