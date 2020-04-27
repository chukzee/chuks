package com.beepmemobile.www.ui.call

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.CallFragmentBinding
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import kotlinx.android.synthetic.main.call_fragment.view.*

class CallFragment : Fragment() {

    private var _binding: CallFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = CallFragment()
    }

    private lateinit var viewModel: CallViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = CallFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        val  tabLayout = binding.callTabLayout
        val viewPager = binding.callViewPager

        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            //set the tab titles
            if(position == 0)
            {
                tab.text = "DIALED"
                //tab.icon = ... //TODO
            }
            else if(position == 1)
            {
                tab.text = "RECEIVED"
                //tab.icon = ... //TODO
            }
            else if(position == 2)
            {
                tab.text = "MISSED"
                //tab.icon = ... //TODO
            }
            //tab.text = "OBJECT ${(position + 1)}"
        }.attach()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(CallViewModel::class.java)
        // TODO: Use the ViewModel
    }

}
