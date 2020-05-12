package com.beepmemobile.www.ui.home

import android.app.ActionBar
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.binding.SearchUserCardListAdapter
import com.beepmemobile.www.ui.main.MainViewModel

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

        Toast.makeText(this.context, "1 - inside onCreateView of HomeFragement", Toast.LENGTH_LONG).show()


        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding.root

        Toast.makeText(this.context, "2 - inside onCreateView of HomeFragement", Toast.LENGTH_LONG).show()

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {


        authNavigation(view)


        super.onViewCreated(view, savedInstanceState)
    }

    private fun authNavigation(view: View){

        val observer = Observer<AppUser> { app_user ->


                if (app_user.authenticated) {

                    viewConten(view)

                } else if (app_user.auth_state == AuthState.AUTH_STAGE_NONE) {

                    view.visibility = View.GONE//come back

                    var direction = HomeFragmentDirections.moveToNavGraphSignup()
                    navController.navigate(direction)
                }

            
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

    }

    private fun viewConten(view: View){

        //set up action bar for navigation
        val setofTopLevelNav = setOf(R.id.nav_graph_home)
        val appBarDrawerConfiguration = AppBarConfiguration(setofTopLevelNav, binding.homeDrawerLayout)

        val appBarConfiguration = AppBarConfiguration(navController.graph)

        binding.homeContent.homeToolbar
            .setupWithNavController(navController, appBarConfiguration)

        binding.homeNavView
            .setupWithNavController(navController)

        activity?.actionBar?.setDisplayHomeAsUpEnabled(true);

        //OR
        //activity?.actionBar?.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM or ActionBar.DISPLAY_SHOW_HOME or ActionBar.DISPLAY_HOME_AS_UP)
        //activity?.actionBar?.setIcon(android.R.color.transparent)

        // bind RecyclerView
            var recyclerView: RecyclerView = binding.homeContent.homePeopleNearbyRecyclerView
            recyclerView.layoutManager = LinearLayoutManager(this.context);
            searchUserCardListAdapter = SearchUserCardListAdapter()
            recyclerView.adapter = searchUserCardListAdapter

            recyclerView.setHasFixedSize(true)


        createObserversAndGetData() // i am working

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
