package com.beepmemobile.www.ui.home

import android.app.AlertDialog
import android.os.Bundle
import android.os.Debug
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavDirections
import androidx.navigation.findNavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.NavigationUI
import androidx.navigation.ui.onNavDestinationSelected
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R
import com.beepmemobile.www.data.AppUser
import com.beepmemobile.www.data.AuthState
import com.beepmemobile.www.data.User

import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.databinding.MainFragmentBinding
import com.beepmemobile.www.ui.binding.SearchUserCardListAdapter
import com.beepmemobile.www.ui.main.MainFragment
import com.beepmemobile.www.ui.main.MainViewModel
import com.beepmemobile.www.ui.signup.*
import kotlinx.android.synthetic.*
import kotlinx.android.synthetic.main.main_fragment.*
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

        Toast.makeText(this.context, "1 - inside onCreateView of HomeFragement", Toast.LENGTH_LONG).show()


        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding.root

        Toast.makeText(this.context, "2 - inside onCreateView of HomeFragement", Toast.LENGTH_LONG).show()

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {


        Toast.makeText(this.context, "1 - inside onViewCreated of HomeFragement", Toast.LENGTH_LONG).show()

        authNavigation(view)

        Toast.makeText(this.context, "2 - inside onViewCreated of HomeFragement", Toast.LENGTH_LONG).show()


        super.onViewCreated(view, savedInstanceState)
    }

    private fun authNavigation(view: View){

        val observer = Observer<AppUser> { app_user ->


                if (app_user.authenticated) {

                    Toast.makeText(
                        this.context,
                        "1 - inside authNavigation of HomeFragement",
                        Toast.LENGTH_LONG
                    ).show()

                    viewConten(view)

                } else if (app_user.auth_state == AuthState.AUTH_STAGE_NONE) {

                    Toast.makeText(
                        this.context,
                        "2 - inside authNavigation of HomeFragement",
                        Toast.LENGTH_LONG
                    ).show()

                    view.visibility = View.GONE//come back

                    Toast.makeText(this.context, "AuthState.AUTH_STAGE_NONE", Toast.LENGTH_LONG)
                        .show()

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

        binding.homeToolbar
            .setupWithNavController(navController, appBarConfiguration)

        binding.homeNavView
            .setupWithNavController(navController)

            // bind RecyclerView
            var recyclerView: RecyclerView = binding.homePeopleNearbyRecyclerView
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
