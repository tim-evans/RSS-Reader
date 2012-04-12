# ==========================================================================
# Project:   RssReader
# Copyright: @2012 My Company, Inc.
# ==========================================================================

# This is your Buildfile, which sets build settings for your project.
# For example, this tells SproutCore's build tools that your requires
# the SproutCore framework.
config :all, :required => [:sproutcore, 'sproutcore/formatters'],
             :url_prefix => 'RSS-Reader/static'

# In addition to this Buildfile, which gives settings for your entire project,
# each of your apps has its own Buildfile with settings specific to that app.
