package com.beepmemobile.www.ui.home

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavDirections
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.data.User

import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.binding.SearchUserCardListAdapter
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.ui.signup.*
import kotlinx.coroutines.launch

class HomeFragment : Fragment() {
    private val model: HomeListViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var searchUserCardListAdapter: SearchUserCardListAdapter? =null

    private val navController by lazy { findNavController() }

    private var _binding: HomeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = HomeFragment()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding.root

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        authNavigation(view)
        super.onViewCreated(view, savedInstanceState)
    }

    private fun authNavigation(view: View){

        val observer = Observer<AppUser> { app_user ->
            var direction : NavDirections? = null;
            if(app_user.authenticated) {
                viewConten(view)
            }else {

                view.visibility = View.GONE//come back

                when (app_user.auth_state) {
                    AuthState.AUTH_STAGE_BEGIN ->
                        direction = HomeFragmentDirections.moveToNavGraphSignup()
                    AuthState.AUTH_STAGE_USERNAME ->
                        direction = SignUpWelcomeFragmentDirections.moveToSignUpUsernameFragment()
                    AuthState.AUTH_STAGE_PASSWORD ->
                        direction = SignUpUsernameFragmentDirections.moveToSignUpPasswordFragment()
                    AuthState.AUTH_STAGE_FULL_NANE ->
                        direction = SignUpPasswordFragmentDirections.moveToSignUpFullNameFragment()
                    AuthState.AUTH_STAGE_PROFILE_PHOTO ->
                        direction =
                            SignUpFullNameFragmentDirections.moveToSignUpProfilePhotoFragment()
                    AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY ->
                        direction =
                            SignUpProfilePhotoFragmentDirections.moveToSignUpPhoneNumberVerificationFragment()
                    AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE ->
                        direction =
                            SignUpPhoneNumberVerificationFragmentDirections.moveToSignUpConfirmVerificationCodeFragment()
                    AuthState.AUTH_STAGE_SUCCESS -> {
                        view.visibility = View.VISIBLE //come back
                        direction =
                            SignUpConfirmVerificationCodeFragmentDirections.moveToHomeFragment()
                    }

                }
            }

            if (direction != null) {
                navController.navigate(direction)
            }

        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

    }

    private fun viewConten(view: View){

        //set up action bar for navigation
        val appBarConfiguration = AppBarConfiguration(navController.graph)
        binding.homeToolbar
            .setupWithNavController(navController, appBarConfiguration)

        //set up navigation drawer for navigation
        var drawerLayout = binding.homeDrawerLayout
        val appBarDrawerConfiguration = AppBarConfiguration(navController.graph, drawerLayout)
        binding.homeNavView
            .setupWithNavController(navController)

        // bind RecyclerView
        var recyclerView: RecyclerView = binding.homePeopleNearbyRecyclerView
        recyclerView.setLayoutManager(LinearLayoutManager(this.context));
        searchUserCardListAdapter = SearchUserCardListAdapter()
        recyclerView.adapter = searchUserCardListAdapter

        createObserversAndGetData()
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<User>> { users ->
            if (app_user != null) {
                searchUserCardListAdapter?.setSearchUserCardList(app_user, users)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }
}
