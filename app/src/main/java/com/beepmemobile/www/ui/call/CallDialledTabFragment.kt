package com.beepmemobile.www.ui.call

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

import com.beepmemobile.www.data.Call
import com.beepmemobile.www.databinding.CallDialledTabFragmentBinding
import com.beepmemobile.www.phone.PhoneCall
import com.beepmemobile.www.ui.binding.CallListAdapter
import com.beepmemobile.www.ui.main.UserListModel
import com.beepmemobile.www.ui.main.MainViewModel
import me.everything.providers.android.calllog.Call.CallType

class CallDialledTabFragment : Fragment() {

    private val callListAdapter: CallListAdapter by lazy { CallListAdapter(Call.DIALLED_CALL) }
    private val usersModel: UserListModel by activityViewModels()
    private val authModel: MainViewModel by activityViewModels()

    private var _binding: CallDialledTabFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding

    companion object {

        @JvmStatic
        fun newInstance(): CallDialledTabFragment {
            return CallDialledTabFragment()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        _binding = CallDialledTabFragmentBinding.inflate(inflater, container, false)
        val view = binding?.root

        // bind RecyclerView
        var recyclerView: RecyclerView? = binding?.callDialledTabRecylerView
        recyclerView?.layoutManager = LinearLayoutManager(this.context);
        recyclerView?.adapter = callListAdapter


        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        var app_user = authModel.app_user ?: return

        var dialledCallList =
            PhoneCall(
                requireContext(),
                app_user,
                usersModel
            ).getCalls(CallType.OUTGOING);

        callListAdapter.setCallList(app_user, dialledCallList)

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
    }

}
