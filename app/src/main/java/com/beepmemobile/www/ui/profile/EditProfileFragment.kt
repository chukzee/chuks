package com.beepmemobile.www.ui.profile

import android.content.res.Configuration
import android.os.Bundle
import android.view.*
import androidx.core.app.ActivityCompat.invalidateOptionsMenu
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.EditProfileFragmentBinding
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Util
import com.google.android.material.appbar.AppBarLayout.OnOffsetChangedListener


class EditProfileFragment : Fragment() {
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private val model: EditProfileViewModel by viewModels()
    private val util = Util()

    private var _binding: EditProfileFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = EditProfileFragment()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setHasOptionsMenu(true)
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = EditProfileFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val layout = binding.editProfileCollapsingToolbarLayout
        val toolbar = binding.editProfileToolbar
        val appBarConfiguration = AppBarConfiguration(navController.graph)
        layout.setupWithNavController(toolbar, navController, appBarConfiguration)

        var mainActivity = this.activity as MainActivity
        mainActivity.setSupportActionBar(toolbar)

        //Update the UI
        binding.user = authModel.app_user; // definitely the app user
        binding.appUser =authModel.app_user
        binding.util = util

        binding.editProfileEditInfoInclude.user = authModel.app_user
        binding.editProfileEditInfoInclude.appUser = authModel.app_user
        binding.editProfileEditInfoInclude.util = util

        var display_name = authModel.app_user?.display_name

        toolbar.title = ""

        binding.editProfileAppBar.addOnOffsetChangedListener(OnOffsetChangedListener { appBarLayout, verticalOffset -> //  Vertical offset == 0 indicates appBar is fully  expanded.

            //If the AppBarLayout’s ‘verticalOffset’ is zero, then its fully expanded

            if (Math.abs(verticalOffset) > 200) {
                //appBarExpanded = false
                //invalidateOptionsMenu()
                toolbar.title =  display_name

            } else {
                toolbar.title =  ""
                //appBarExpanded = true
                //invalidateOptionsMenu()
            }

        })

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.edit_profille_app_bar, menu)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
