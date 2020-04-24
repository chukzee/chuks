            <div class="span4">

                <aside class="left-sidebar">

                    <div class="widget">
                        <?php dynamic_sidebar('sidebar-single-1'); ?>
                    </div>

                    <div class="widget">
                        <?php dynamic_sidebar('sidebar-single-2'); ?>
                    </div>


                    <div class="widget">
                        <div class="tabs">
                            <ul class="nav nav-tabs">
                                <li class="active"><a href="#one" data-toggle="tab"><i class="icon-star"></i> Popular</a></li>
                                <li><a href="#two" data-toggle="tab">Recent</a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane active" id="one">
                                    <?php dynamic_sidebar('sidebar-single-popular-posts'); ?>
                                </div>
                                <div class="tab-pane" id="two">
                                    <?php dynamic_sidebar('sidebar-single-recent-posts'); ?>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="widget">
                        <?php dynamic_sidebar('sidebar-single-3'); ?>
                    </div>

                    <div class="widget">
                        <?php dynamic_sidebar('sidebar-single-4'); ?>
                    </div>
                    <div class="widget">
                        <?php dynamic_sidebar('sidebar-single-5'); ?>
                    </div>
                </aside>
            </div>

