package com.beepmemobile.www.ui.home

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.beepmemobile.www.Auth
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.data.User

import com.beepmemobile.www.databinding.HomeFragmentBinding
import com.beepmemobile.www.ui.binding.SearchUserCardListAdapter
import com.beepmemobile.www.ui.signup.SignUpWelcomeFragmentDirections

class HomeFragment : Fragment() {
    private val model: HomeListViewModel by viewModels()
    private var searchUserCardListAdapter: SearchUserCardListAdapter? =null

    val navController by lazy { findNavController() }

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



        if(!Auth().checkOTP()){
            var direction = HomeFragmentDirections.actionHomeFragmentToNavGraphSignup()
            navController.navigate(direction)
        }


        _binding = HomeFragmentBinding.inflate(inflater, container, false)
            val view = binding.root

            // bind RecyclerView
            var recyclerView: RecyclerView = binding.homePeopleNearbyRecyclerView
            recyclerView.setLayoutManager(LinearLayoutManager(this.context));
            searchUserCardListAdapter = SearchUserCardListAdapter()
            recyclerView.adapter = searchUserCardListAdapter

            createObserversAndGetData()

        return view
    }

    private fun createObserversAndGetData(){
        var main_act : MainActivity = this.activity as MainActivity
        var app_user = main_act.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<User>> { users ->
            searchUserCardListAdapter?.setSearchUserCardList(app_user, users)
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
