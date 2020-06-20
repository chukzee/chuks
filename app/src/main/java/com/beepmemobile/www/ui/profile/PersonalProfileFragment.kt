package com.beepmemobile.www.ui.profile

import android.content.res.Configuration
import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.PersonalProfileFragmentBinding
import com.beepmemobile.www.ui.main.UserListModel
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.util.Constant
import com.beepmemobile.www.util.Util
import com.google.android.material.appbar.AppBarLayout

class PersonalProfileFragment : Fragment() {
    private val model: PersonalProfileViewModel by viewModels()
    private val navController by lazy { findNavController() }
    private val authModel: MainViewModel by activityViewModels()
    private val usersModel: UserListModel by activityViewModels()
    private val util = Util()
    private var _binding: PersonalProfileFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() =
            PersonalProfileFragment()
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
        _binding = PersonalProfileFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val layout = binding.personalProfileCollapsingToolbarLayout
        val toolbar = binding.personalProfileToolbar
        val appBarConfiguration = AppBarConfiguration(navController.graph)
        layout.setupWithNavController(toolbar, navController, appBarConfiguration)

        var mainActivity = this.activity as MainActivity
        mainActivity.setSupportActionBar(toolbar)

        var user_id = arguments?.getString(Constant.USER_ID)

        if(user_id != null) {//other user
            createObserversAndGetData(user_id)
        }else{//app user
            updateUI(authModel.app_user);
        }

        var display_name = authModel.app_user?.display_name

        (activity as MainActivity).supportActionBar?.setTitle(R.string.empty)

        binding.personalProfileAppBar.addOnOffsetChangedListener(AppBarLayout.OnOffsetChangedListener { appBarLayout, verticalOffset -> //  Vertical offset == 0 indicates appBar is fully  expanded.

            //If the AppBarLayout’s ‘verticalOffset’ is zero, then its fully expanded

            if (Math.abs(verticalOffset) > 200) {
                //appBarExpanded = false
                //invalidateOptionsMenu()
                (activity as MainActivity).supportActionBar?.setTitle(display_name)

            } else {
                //appBarExpanded = true
                //invalidateOptionsMenu()
                (activity as MainActivity).supportActionBar?.setTitle(R.string.empty)
            }

        })

    }

    private fun createObserversAndGetData(user_id: String?){

        // Create the observer which updates the UI.
        val observer = Observer<MutableList<User>> { users ->
            var user = usersModel.getUser(user_id);
            //Update the UI
            updateUI(user)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        usersModel.getList().observe(viewLifecycleOwner, observer)

    }

    private fun updateUI(user: User?){
        binding.user = user;
        binding.appUser = authModel.app_user
        binding.util = util

        binding.personalProfileScrollingContent.user = user
        binding.personalProfileScrollingContent.appUser = authModel.app_user
        binding.personalProfileScrollingContent.util = util

        binding.personalProfileScrollingContent.personalProfilePhoneNumberInclude.user = user
        binding.personalProfileScrollingContent.personalProfilePhoneNumberInclude.appUser = authModel.app_user
        binding.personalProfileScrollingContent.personalProfilePhoneNumberInclude.util = util

        binding.personalProfileScrollingContent.personalProfileEmailAddressInclude.user = user
        binding.personalProfileScrollingContent.personalProfileEmailAddressInclude.appUser = authModel.app_user
        binding.personalProfileScrollingContent.personalProfileEmailAddressInclude.util = util

        binding.personalProfileScrollingContent.personalProfileAddressInclude.user = user
        binding.personalProfileScrollingContent.personalProfileAddressInclude.appUser = authModel.app_user
        binding.personalProfileScrollingContent.personalProfileAddressInclude.util = util
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.edit_profile_fragment -> {
					
				var direction = PersonalProfileFragmentDirections.toEditProfileFragment()
				navController.navigate(direction.actionId)
                true
            }
            R.id.personal_profile_settings_fragment -> {
					
				var direction = PersonalProfileFragmentDirections.toPersonalProfileSettingsFragment()
				navController.navigate(direction.actionId)
                
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.personal_profile_app_bar, menu)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

    }

}
