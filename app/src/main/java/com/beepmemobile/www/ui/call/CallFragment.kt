package com.beepmemobile.www.ui.call

import android.os.Bundle
import android.view.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.beepmemobile.www.MainActivity
import com.beepmemobile.www.R

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.CallFragmentBinding
import com.beepmemobile.www.databinding.CallListItemBinding
import com.beepmemobile.www.ui.binding.CallListAdapter
import com.beepmemobile.www.ui.main.MainViewModel
import com.google.android.material.tabs.TabLayoutMediator

class CallFragment : Fragment() {

    private val model: CallListViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val callListAdapter: CallListAdapter by lazy { CallListAdapter() }
    private val navController by lazy { findNavController() }
    private lateinit var viewPager: ViewPager2
    private var tab_titles = arrayOf<String>("DIALLED","RECEIVED","MISSED")
    private var _binding: CallFragmentBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = CallFragment()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setHasOptionsMenu(true)
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = CallFragmentBinding.inflate(inflater, container, false)
        val view = binding.root

        binding.callViewPager.adapter = CallTabViewPagerAdapter(this, callListAdapter, tab_titles)

        createObserversAndGetData()

        return view
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {


        val tabLayout = binding.callTabLayout
        viewPager = binding.callViewPager

        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
              tab.text = tab_titles[position];
            //tab.icon = ...//TODO
            //tab.badge = ...//TODO
        }.attach()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun createObserversAndGetData(){
        var app_user = authModel.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<Call>> { calls ->
            if (app_user != null) {
                callListAdapter.setCallList(app_user, calls)
            }
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {

        menu.clear() // clear the initial ones, otherwise they are included

        // Inflate the menu; this adds items to the action bar if it is present.
        inflater.inflate(R.menu.call_app_bar, menu)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
