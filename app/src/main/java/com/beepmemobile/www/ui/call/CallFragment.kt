package com.beepmemobile.www.ui.call

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.viewpager2.widget.ViewPager2
import com.beepmemobile.www.MainActivity

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.data.User
import com.beepmemobile.www.databinding.CallFragmentBinding
import com.beepmemobile.www.databinding.CallListItemBinding
import com.beepmemobile.www.ui.binding.CallListAdapter
import com.google.android.material.tabs.TabLayoutMediator

class CallFragment : Fragment() {

    private val model: CallListViewModel by viewModels()
    private val callListAdapter: CallListAdapter by lazy { CallListAdapter() }
    private lateinit var viewPager: ViewPager2
    private var tab_titles = arrayOf<String>("DIALLED","RECEIVED","MISSED")
    private var _binding: CallFragmentBinding? = null

    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = CallFragment()
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
        var main_act : MainActivity = this.activity as MainActivity
        var app_user = main_act.app_user
        // Create the observer which updates the UI.
        val observer = Observer<MutableList<Call>> { calls ->
            callListAdapter?.setCallList(app_user, calls)
        }

        // Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        model.getList().observe(viewLifecycleOwner, observer)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
